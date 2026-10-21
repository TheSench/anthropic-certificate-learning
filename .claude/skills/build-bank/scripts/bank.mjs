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

const USAGE =
  "usage: bank.mjs validate <bank.json> | stamp <bank.json> <model> | status <bank.json>\n" +
  "       bank.mjs pick <prompts/tierT/NN-slug.md> [--n <k>] [--seen <jsonl>] | key [--seen <jsonl>] <id>...";

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

function keyPositionRules(keys) {
  const rules = [];
  const keyCounts = tally(keys);
  if ([...keyCounts.values()].some((n) => n > keys.length / 2)) rules.push("key-skew");
  if (keys.length >= 4 && keyCounts.size < 3) rules.push("key-variety");
  return rules;
}

function batchViolations(items) {
  const v = [];
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.id)) v.push({ rule: "duplicate-id", itemId: item.id });
    seen.add(item.id);
  }
  if (items.length < MIN_ITEMS) v.push({ rule: "too-few-items" });

  for (const rule of keyPositionRules(items.map((i) => i.answerKey))) v.push({ rule });
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

// A bank passes gate 5 as a whole, but a lesson asks a handful of its items, and that
// handful is a batch the gate applies to as well, for key position and key length alike.
export function pickItems(items, seenIds, n) {
  const pool = items.filter((i) => !seenIds.has(i.id));
  const size = Math.min(n, pool.length);
  const maxSpread = Math.min(size, new Set(pool.map((i) => i.objective)).size);
  const score = (combo) => [
    keyPositionRules(combo.map((i) => i.answerKey)).length === 0 && keyExtremeRules(combo).length === 0 ? 1 : 0,
    new Set(combo.map((i) => i.objective)).size,
  ];

  let best = null;
  let bestScore = [-1, -1];
  const search = (start, combo) => {
    if (combo.length === size) {
      const s = score(combo);
      if (s[0] > bestScore[0] || (s[0] === bestScore[0] && s[1] > bestScore[1])) {
        best = [...combo];
        bestScore = s;
      }
      return bestScore[0] === 1 && bestScore[1] === maxSpread;
    }
    for (let i = start; i <= pool.length - (size - combo.length); i++) {
      combo.push(pool[i]);
      const done = search(i + 1, combo);
      combo.pop();
      if (done) return true;
    }
    return false;
  };
  search(0, []);
  return { items: best ?? [], short: n - size };
}

export function bankPathFor(repoRoot, promptFile) {
  const m = /^prompts\/(tier[1-4])\/(\d{2}-[^/]+)\.md$/.exec(promptFile);
  return m && path.join(repoRoot, "banks", m[1], `${m[2]}.json`);
}

function bankPathForItem(repoRoot, id) {
  const m = /^t([1-4])-(\d{2})-i\d{2}$/.exec(id);
  if (!m) return null;
  const dir = path.join(repoRoot, "banks", `tier${m[1]}`);
  let names;
  try {
    names = fs.readdirSync(dir).filter((f) => f.startsWith(`${m[2]}-`) && f.endsWith(".json"));
  } catch {
    return null;
  }
  return names.length === 1 ? path.join(dir, names[0]) : null;
}

function readSeen(seenPath) {
  let text;
  try {
    text = fs.readFileSync(seenPath, "utf8");
  } catch {
    return new Set();
  }
  const ids = new Set();
  for (const line of text.split("\n")) {
    try {
      const { id } = JSON.parse(line);
      if (typeof id === "string") ids.add(id);
    } catch {}
  }
  return ids;
}

function pickCommand(repoRoot, promptFile, n, seenPath) {
  const bankPath = bankPathFor(repoRoot, promptFile);
  const status = bankPath ? bankStatus(repoRoot, bankPath) : "absent";
  if (status !== "ok") {
    console.log(`fallback ${status}`);
    return;
  }
  const { items } = JSON.parse(fs.readFileSync(bankPath, "utf8"));
  const picked = pickItems(items, readSeen(seenPath), n);
  const blocks = picked.items.map((it) =>
    [`=== ${it.id}`, it.question.prompt, ...it.question.options.map((o) => `${o.key}. ${o.text}`)].join("\n"),
  );
  console.log([`bank ok · ${picked.items.length} items · short ${picked.short}`, ...blocks].join("\n\n"));
}

function keyCommand(repoRoot, ids, seenPath) {
  const found = [];
  const unknown = [];
  for (const id of ids) {
    const bankPath = bankPathForItem(repoRoot, id);
    let bank = null;
    try {
      bank = bankPath && validateBank(JSON.parse(fs.readFileSync(bankPath, "utf8"))).bank;
    } catch {}
    const it = bank?.items.find((i) => i.id === id);
    if (it) found.push(it);
    else unknown.push(id);
  }
  if (unknown.length) {
    for (const id of unknown) console.log(`FAIL unknown-id ${id}`);
    process.exit(1);
  }

  for (const it of found) {
    console.log(`=== ${it.id} · key ${it.answerKey}`);
    for (const a of it.autopsy) console.log(`${a.option} · tempting: ${a.tempting} · ruled out by: ${a.ruledOutBy}`);
  }

  const seen = readSeen(seenPath);
  const date = new Date().toISOString().slice(0, 10);
  const fresh = [...new Set(found.map((it) => it.id))].filter((id) => !seen.has(id));
  if (fresh.length) {
    fs.mkdirSync(path.dirname(seenPath), { recursive: true });
    fs.appendFileSync(seenPath, fresh.map((id) => JSON.stringify({ id, date }) + "\n").join(""));
  }
}

function main() {
  const repoRoot = process.env.BANK_REPO_ROOT ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
  const args = process.argv.slice(2);
  const flag = (name, fallback) => {
    const i = args.indexOf(name);
    if (i === -1) return fallback;
    const [, value] = args.splice(i, 2);
    return value;
  };
  const seenPath = path.resolve(flag("--seen", path.join(repoRoot, "learner", "seen-items.jsonl")));
  const n = Number(flag("--n", "5"));
  const [command, bankPath, model] = args;

  if (command === "pick" && bankPath && Number.isInteger(n) && n > 0) return pickCommand(repoRoot, bankPath, n, seenPath);
  if (command === "key" && bankPath) return keyCommand(repoRoot, args.slice(1), seenPath);

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
