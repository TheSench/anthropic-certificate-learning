#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const MIN_ITEMS = 10;
export const MAX_PER_OBJECTIVE = 3;
const OPTION_KEYS = ["A", "B", "C", "D"];
const ITEM_ID = /^t[1-4]-\d{2}-i\d{2}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const USAGE = "usage: bank.mjs validate <bank.json> | stamp <bank.json> <model> | status <bank.json>";

export function sha256(text) {
  return `sha256:${crypto.createHash("sha256").update(text).digest("hex")}`;
}

export function promptHashOf(repoRoot, promptFile) {
  return sha256(fs.readFileSync(path.join(repoRoot, promptFile), "utf8"));
}

export function gatesHashOf(repoRoot) {
  const docs = path.join(repoRoot, ".agents", "docs");
  return sha256(
    fs.readFileSync(path.join(docs, "GATES.md"), "utf8") +
      "\n" +
      fs.readFileSync(path.join(docs, "TRAPS.md"), "utf8"),
  );
}

// Structural check only: a violation carries the path of the bad field, never
// its value, because nobody reads bank items and a quoted stem would spoil it.
function schemaPaths(raw) {
  const bad = [];
  const isObj = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
  const str = (v, p) => typeof v === "string" || bad.push(p);
  const strArray = (v, p) => {
    if (!Array.isArray(v)) return void bad.push(p);
    v.forEach((s, i) => str(s, `${p}.${i}`));
  };
  const each = (v, p, fn) => {
    if (!Array.isArray(v)) return void bad.push(p);
    v.forEach((x, i) => (isObj(x) ? fn(x, `${p}.${i}`) : bad.push(`${p}.${i}`)));
  };

  if (!isObj(raw)) return [""];
  if (!isObj(raw.meta)) bad.push("meta");
  else {
    for (const k of ["promptFile", "promptHash", "gatesHash", "builtAt", "model"]) str(raw.meta[k], `meta.${k}`);
  }
  each(raw.facts, "facts", (f, p) => {
    for (const k of ["id", "claim", "value", "sourceUrl"]) str(f[k], `${p}.${k}`);
    if (typeof f.checkedOn !== "string" || !DATE.test(f.checkedOn)) bad.push(`${p}.checkedOn`);
  });
  each(raw.items, "items", (it, p) => {
    if (typeof it.id !== "string" || !ITEM_ID.test(it.id)) bad.push(`${p}.id`);
    str(it.task, `${p}.task`);
    if (!Number.isInteger(it.objective) || it.objective < 0) bad.push(`${p}.objective`);
    strArray(it.trapFamilies, `${p}.trapFamilies`);
    strArray(it.factRefs, `${p}.factRefs`);
    str(it.answerKey, `${p}.answerKey`);
    if (!isObj(it.question)) {
      bad.push(`${p}.question`);
    } else {
      const q = it.question;
      str(q.type, `${p}.question.type`);
      str(q.id, `${p}.question.id`);
      str(q.prompt, `${p}.question.prompt`);
      if (q.type !== "free_text") {
        each(q.options, `${p}.question.options`, (o, op) => {
          str(o.key, `${op}.key`);
          str(o.text, `${op}.text`);
        });
      }
    }
    each(it.autopsy, `${p}.autopsy`, (a, ap) => {
      for (const k of ["option", "tempting", "ruledOutBy"]) str(a[k], `${ap}.${k}`);
    });
  });
  return bad;
}

function itemViolations(item, factIds) {
  const v = [];
  const at = (rule) => v.push({ rule, itemId: item.id });
  const q = item.question;
  if (q.id !== item.id) at("id-mismatch");
  if (q.type !== "multiple_choice") {
    at("type");
    return v;
  }
  const keys = q.options.map((o) => o.key);
  if (keys.length !== 4 || keys.some((k, i) => k !== OPTION_KEYS[i])) at("option-keys");
  if (!keys.includes(item.answerKey)) at("key-not-option");
  const wrong = keys.filter((k) => k !== item.answerKey).sort().join(",");
  const covered = [...new Set(item.autopsy.map((a) => a.option))].sort().join(",");
  if (item.autopsy.length !== keys.length - 1 || covered !== wrong) at("autopsy-coverage");
  if (item.factRefs.some((ref) => !factIds.has(ref))) at("fact-ref");
  if (keys.includes(item.answerKey)) for (const rule of keyLengthRules(q.options, item.answerKey)) at(rule);
  return v;
}

// Gate 5's length half, with the thresholds and tie-breaking of .agents/check-key-length.py,
// so bank items and drill cards are held to the same rule.
const MAX_KEY_RATIO = 1.25;
const SENTENCE_BREAK = /[.;](?=\s+\S)/;

function keyLengthRules(options, answerKey) {
  const key = options.find((o) => o.key === answerKey).text;
  const distractors = options.filter((o) => o.key !== answerKey).map((o) => o.text);
  const rules = [];
  if (key.length / Math.max(...distractors.map((d) => d.length)) > MAX_KEY_RATIO) rules.push("key-length");
  if (SENTENCE_BREAK.test(key) && !distractors.some((d) => SENTENCE_BREAK.test(d))) rules.push("key-clause");
  return rules;
}

function extremeOptionKey(options, longest) {
  return options.reduce((best, o) =>
    (longest ? o.text.length > best.text.length : o.text.length < best.text.length) ? o : best,
  ).key;
}

function keyExtremeRules(items) {
  const scorable = items.filter(
    (i) => i.question.type === "multiple_choice" && i.question.options.some((o) => o.key === i.answerKey),
  );
  const cap = Math.ceil(items.length / 3);
  const hits = (longest) => scorable.filter((i) => extremeOptionKey(i.question.options, longest) === i.answerKey).length;
  const rules = [];
  if (hits(true) > cap) rules.push("key-longest");
  if (hits(false) > cap) rules.push("key-shortest");
  return rules;
}

function tally(values) {
  const counts = new Map();
  for (const x of values) counts.set(x, (counts.get(x) ?? 0) + 1);
  return counts;
}

function batchViolations(items) {
  const v = [];
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.id)) v.push({ rule: "duplicate-id", itemId: item.id });
    seen.add(item.id);
  }
  if (items.length < MIN_ITEMS) v.push({ rule: "too-few-items" });

  const keyCounts = tally(items.map((i) => i.answerKey));
  if ([...keyCounts.values()].some((n) => n > items.length / 2)) v.push({ rule: "key-skew" });
  if (items.length >= 4 && keyCounts.size < 3) v.push({ rule: "key-variety" });
  for (const rule of keyExtremeRules(items)) v.push({ rule });

  const perObjective = tally(items.map((i) => i.objective));
  if ([...perObjective.values()].some((n) => n > MAX_PER_OBJECTIVE)) v.push({ rule: "objective-overload" });
  return v;
}

export function validateBank(raw) {
  const paths = schemaPaths(raw);
  if (paths.length) return { bank: null, violations: paths.map((path) => ({ rule: "schema", path })) };
  const factIds = new Set(raw.facts.map((f) => f.id));
  return {
    bank: raw,
    violations: [...raw.items.flatMap((i) => itemViolations(i, factIds)), ...batchViolations(raw.items)],
  };
}

export function bankStatus(repoRoot, bankPath) {
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(path.resolve(bankPath), "utf8"));
  } catch {
    return "absent";
  }
  const { bank, violations } = validateBank(raw);
  if (!bank || violations.length) return "absent";

  let promptHash;
  try {
    promptHash = promptHashOf(repoRoot, bank.meta.promptFile);
  } catch {
    return "absent";
  }
  if (bank.meta.promptHash !== promptHash) return "stale-prompt";
  try {
    if (bank.meta.gatesHash !== gatesHashOf(repoRoot)) return "stale-gates";
  } catch {
    return "stale-gates";
  }
  return "ok";
}

function main() {
  const repoRoot = process.env.BANK_REPO_ROOT ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
  const [command, bankPath, model] = process.argv.slice(2);

  if (!bankPath) {
    console.error(USAGE);
    process.exit(2);
  }

  const read = () => {
    try {
      return JSON.parse(fs.readFileSync(path.resolve(bankPath), "utf8"));
    } catch (err) {
      console.log(err instanceof SyntaxError ? "FAIL not-json" : "FAIL unreadable");
      process.exit(1);
    }
  };

  if (command === "validate") {
    const { bank, violations } = validateBank(read());
    if (bank) {
      const keys = tally(bank.items.map((i) => i.answerKey));
      const objectives = tally(bank.items.map((i) => i.objective));
      console.log(`items ${bank.items.length} · facts ${bank.facts.length}`);
      console.log(`keys ${[...keys].sort().map(([k, n]) => `${k}${n}`).join(" ")}`);
      console.log(`objectives ${[...objectives].sort((a, b) => a[0] - b[0]).map(([o, n]) => `${o}:${n}`).join(" ")}`);
    }
    for (const v of violations) {
      console.log(`FAIL ${v.rule}${v.itemId ? ` ${v.itemId}` : ""}${v.path ? ` @${v.path}` : ""}`);
    }
    process.exit(violations.length ? 1 : 0);
  } else if (command === "stamp" && model) {
    const raw = read();
    if (typeof raw?.meta !== "object" || raw.meta === null || Array.isArray(raw.meta)) {
      console.log("FAIL no-meta");
      process.exit(1);
    }
    try {
      raw.meta.promptHash = promptHashOf(repoRoot, raw.meta.promptFile);
      raw.meta.gatesHash = gatesHashOf(repoRoot);
    } catch {
      console.log("FAIL unreadable-hash-input");
      process.exit(1);
    }
    raw.meta.builtAt = new Date().toISOString().slice(0, 10);
    raw.meta.model = model;
    fs.writeFileSync(path.resolve(bankPath), JSON.stringify(raw, null, 2) + "\n");
    console.log(`stamped ${bankPath}`);
  } else if (command === "status") {
    console.log(bankStatus(repoRoot, bankPath));
  } else {
    console.error(USAGE);
    process.exit(2);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) main();
