import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateBank, bankStatus, sha256, promptHashOf, gatesHashOf, pickItems } from "./bank.mjs";

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), "bank.mjs");
const KEYS = ["A", "B", "C", "D"];
const PROMPT_FILE = "prompts/tier1/06-x.md";

function item(n, overrides = {}) {
  const id = `t1-06-i${String(n).padStart(2, "0")}`;
  const answerKey = KEYS[n % 4];
  return {
    id,
    task: "5.1",
    objective: n % 5,
    trapFamilies: [`SECRET-TRAP-${n}`],
    factRefs: [],
    question: {
      type: "multiple_choice",
      id,
      prompt: `SECRET-STEM-${n}`,
      options: KEYS.map((key) => ({ key, text: `SECRET-OPTION-${n}-${key}` })),
    },
    answerKey,
    autopsy: KEYS.filter((k) => k !== answerKey).map((option) => ({
      option,
      tempting: `SECRET-TEMPTING-${n}`,
      ruledOutBy: `SECRET-RULED-OUT-${n}`,
    })),
    audit: { note: `SECRET-AUDIT-${n}` },
    ...overrides,
  };
}

function bank(items = Array.from({ length: 12 }, (_, i) => item(i + 1)), meta = {}) {
  return {
    meta: {
      promptFile: PROMPT_FILE,
      promptHash: "sha256:p",
      gatesHash: "sha256:g",
      builtAt: "2026-10-07",
      model: "claude-opus-5-5",
      ...meta,
    },
    facts: [],
    items,
  };
}

function keyedA() {
  return {
    answerKey: "A",
    autopsy: ["B", "C", "D"].map((option) => ({ option, tempting: "t", ruledOutBy: "r" })),
  };
}

const rules = (raw) => validateBank(raw).violations.map((v) => v.rule);

describe("validateBank", () => {
  test("accepts a well-formed bank", () => {
    const result = validateBank(bank());
    assert.deepEqual(result.violations, []);
    assert.equal(result.bank.items.length, 12);
  });

  test("rejects a schema-invalid bank with no item content in the violation", () => {
    const result = validateBank({ meta: {}, facts: [], items: "nope" });
    assert.equal(result.bank, null);
    assert.equal(result.violations[0].rule, "schema");
  });

  test("reports the path of a malformed field and nothing else", () => {
    const b = bank();
    b.items[3].question.options = "SECRET-NOT-AN-ARRAY";
    const { bank: parsed, violations } = validateBank(b);
    assert.equal(parsed, null);
    assert.deepEqual(violations, [{ rule: "schema", path: "items.3.question.options" }]);
  });

  test("rejects an item id outside the t[1-4]-NN-iNN shape", () => {
    const b = bank();
    b.items[0] = item(1, { id: "t5-06-i01" });
    assert.equal(validateBank(b).bank, null);
  });

  test("rejects a malformed fact date", () => {
    const b = bank();
    b.facts = [{ id: "f1", claim: "c", value: "v", sourceUrl: "u", checkedOn: "yesterday" }];
    assert.deepEqual(validateBank(b).violations, [{ rule: "schema", path: "facts.0.checkedOn" }]);
  });

  test("rejects a non-integer objective", () => {
    const b = bank();
    b.items[0] = item(1, { objective: 1.5 });
    assert.deepEqual(validateBank(b).violations, [{ rule: "schema", path: "items.0.objective" }]);
  });

  test("accepts optional audit of any shape", () => {
    const b = bank();
    b.items[0] = item(1, { audit: { anything: [1, "x"] } });
    assert.deepEqual(validateBank(b).violations, []);
  });

  test("rejects a question id that differs from the item id", () => {
    const b = bank();
    b.items[0] = item(1, { question: { ...item(1).question, id: "other" } });
    assert.ok(rules(b).includes("id-mismatch"));
  });

  test("rejects a non-multiple-choice question", () => {
    const b = bank();
    b.items[0] = item(1, { question: { ...item(1).question, type: "multi_select" } });
    assert.ok(rules(b).includes("type"));
  });

  test("rejects options not keyed exactly A-D", () => {
    const b = bank();
    const q = item(1).question;
    b.items[0] = item(1, { question: { ...q, options: q.options.slice(0, 3) } });
    assert.ok(rules(b).includes("option-keys"));
  });

  test("rejects a key that is not an option", () => {
    const b = bank();
    b.items[0] = item(1, { answerKey: "E" });
    assert.ok(rules(b).includes("key-not-option"));
  });

  test("rejects an autopsy that does not cover exactly the wrong options", () => {
    const b = bank();
    b.items[0] = item(1, { autopsy: item(1).autopsy.slice(0, 2) });
    assert.ok(rules(b).includes("autopsy-coverage"));
  });

  test("rejects an unresolved fact ref", () => {
    const b = bank();
    b.items[0] = item(1, { factRefs: ["f9"] });
    assert.ok(rules(b).includes("fact-ref"));
  });

  test("rejects duplicate ids", () => {
    const b = bank();
    b.items[1] = item(1);
    assert.ok(rules(b).includes("duplicate-id"));
  });

  test("rejects a bank where one letter holds more than half the keys", () => {
    const b = bank(
      Array.from({ length: 12 }, (_, i) => {
        const base = item(i + 1);
        return i < 7 ? { ...base, ...keyedA() } : base;
      }),
    );
    assert.ok(rules(b).includes("key-skew"));
  });

  test("rejects a bank using fewer than three distinct keys", () => {
    const b = bank(
      Array.from({ length: 12 }, (_, i) => {
        const base = item(i + 1);
        if (i % 2 === 0) return { ...base, ...keyedA() };
        return {
          ...base,
          answerKey: "B",
          autopsy: ["A", "C", "D"].map((option) => ({ option, tempting: "t", ruledOutBy: "r" })),
        };
      }),
    );
    const r = rules(b);
    assert.ok(r.includes("key-variety"));
    assert.ok(!r.includes("key-skew"));
  });

  test("rejects a bank under the minimum size", () => {
    assert.ok(rules(bank(Array.from({ length: 9 }, (_, i) => item(i + 1)))).includes("too-few-items"));
  });

  test("rejects an objective holding more than three items", () => {
    const b = bank(Array.from({ length: 12 }, (_, i) => item(i + 1, { objective: i < 4 ? 0 : i })));
    assert.ok(rules(b).includes("objective-overload"));
  });

  test("never puts item text in a violation", () => {
    const b = bank(Array.from({ length: 3 }, (_, i) => item(i + 1, { factRefs: ["missing"] })));
    assert.doesNotMatch(JSON.stringify(validateBank(b).violations), /SECRET/);
  });

  test("rejects a key more than 1.25x its longest distractor, and accepts exactly 1.25x", () => {
    const over = bank();
    over.items[0] = withOptions(1, "B", { B: "k".repeat(131) });
    assert.deepEqual(lengthRules(over), [{ rule: "key-length", itemId: "t1-06-i01" }]);
    const edge = bank();
    edge.items[0] = withOptions(1, "B", { B: "k".repeat(130) });
    assert.deepEqual(lengthRules(edge), []);
  });

  test("rejects a key with a clause no distractor has, unless a distractor has one too", () => {
    const clause = bank();
    clause.items[0] = withOptions(1, "B", { B: "SECRET do this. Then that" });
    assert.deepEqual(lengthRules(clause), [{ rule: "key-clause", itemId: "t1-06-i01" }]);
    const shared = bank();
    shared.items[0] = withOptions(1, "B", { B: "SECRET do this. Then that", C: "SECRET this; or that" });
    assert.deepEqual(lengthRules(shared), []);
    const trailing = bank();
    trailing.items[0] = withOptions(1, "B", { B: "SECRET ends with a stop." });
    assert.deepEqual(lengthRules(trailing), []);
  });

  test("rejects a bank whose longest option is the key in more than a third of items", () => {
    const longKeys = (count) =>
      bank(Array.from({ length: 12 }, (_, i) => withOptions(i + 1, KEYS[(i + 1) % 4], i < count ? { [KEYS[(i + 1) % 4]]: "L".repeat(110) } : {})));
    assert.deepEqual(lengthRules(longKeys(4)), []);
    assert.deepEqual(lengthRules(longKeys(5)), [{ rule: "key-longest" }]);
  });

  test("rounds the third up: 13 items allow the longest option as key 5 times", () => {
    const b = bank(Array.from({ length: 13 }, (_, i) => withOptions(i + 1, KEYS[(i + 1) % 4], i < 5 ? { [KEYS[(i + 1) % 4]]: "L".repeat(110) } : {})));
    assert.deepEqual(lengthRules(b), []);
  });

  test("rejects a bank whose shortest option is the key in more than a third of items", () => {
    const shortKeys = (count) =>
      bank(Array.from({ length: 12 }, (_, i) => withOptions(i + 1, KEYS[(i + 1) % 4], i < count ? { [KEYS[(i + 1) % 4]]: "S".repeat(90) } : {})));
    assert.deepEqual(lengthRules(shortKeys(4)), []);
    assert.deepEqual(lengthRules(shortKeys(5)), [{ rule: "key-shortest" }]);
  });

  test("breaks a length tie toward the first option in A-D order, as check-key-length.py does", () => {
    const equal = Object.fromEntries(KEYS.map((k) => [k, "e".repeat(100)]));
    const keyedA = (count) =>
      bank(Array.from({ length: 12 }, (_, i) => withOptions(i + 1, i < count ? "A" : KEYS[1 + (i % 3)], equal)));
    assert.deepEqual(lengthRules(keyedA(4)), []);
    assert.deepEqual(lengthRules(keyedA(5)), [{ rule: "key-longest" }, { rule: "key-shortest" }]);
  });

  test("never puts item text in a length violation", () => {
    const b = bank();
    b.items[0] = withOptions(1, "B", { B: "SECRET do this. Then that" + "x".repeat(200) });
    assert.doesNotMatch(JSON.stringify(validateBank(b).violations), /SECRET/);
  });
});

// The key defaults to 100 characters and the distractors to 104, 100 and 96, so the longest
// and shortest options are distractors unless a test overrides a length.
function withOptions(n, answerKey, texts = {}) {
  const id = `t1-06-i${String(n).padStart(2, "0")}`;
  const distractorLengths = [104, 100, 96];
  const defaultText = (key) =>
    key === answerKey ? "k".repeat(100) : "d".repeat(distractorLengths[KEYS.filter((k) => k !== answerKey).indexOf(key)]);
  return item(n, {
    question: {
      type: "multiple_choice",
      id,
      prompt: `SECRET-STEM-${n}`,
      options: KEYS.map((key) => ({ key, text: texts[key] ?? defaultText(key) })),
    },
    answerKey,
    autopsy: KEYS.filter((k) => k !== answerKey).map((option) => ({ option, tempting: "t", ruledOutBy: "r" })),
  });
}

const LENGTH_RULES = new Set(["key-length", "key-clause", "key-longest", "key-shortest"]);
const lengthRules = (raw) => validateBank(raw).violations.filter((v) => LENGTH_RULES.has(v.rule));

describe("CLI and status", () => {
  let root;
  let outputs;
  const promptText = "prompt body\n";
  const gatesText = "gates body\n";
  const trapsText = "traps body\n";

  before(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "bank-test-"));
    outputs = [];
    fs.mkdirSync(path.join(root, "prompts/tier1"), { recursive: true });
    fs.mkdirSync(path.join(root, ".agents/docs"), { recursive: true });
    fs.writeFileSync(path.join(root, PROMPT_FILE), promptText);
    fs.writeFileSync(path.join(root, ".agents/docs/GATES.md"), gatesText);
    fs.writeFileSync(path.join(root, ".agents/docs/TRAPS.md"), trapsText);
  });

  after(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  function run(...args) {
    const r = spawnSync(process.execPath, [SCRIPT, ...args], {
      encoding: "utf8",
      env: { ...process.env, BANK_REPO_ROOT: root },
    });
    outputs.push(r.stdout + r.stderr);
    return r;
  }

  function write(name, data) {
    const file = path.join(root, name);
    fs.writeFileSync(file, typeof data === "string" ? data : JSON.stringify(data));
    return file;
  }

  const currentMeta = () => ({
    promptHash: promptHashOf(root, PROMPT_FILE),
    gatesHash: gatesHashOf(root),
  });

  test("hashes match the documented formulas", () => {
    assert.equal(promptHashOf(root, PROMPT_FILE), sha256(promptText));
    assert.equal(gatesHashOf(root), sha256(gatesText + "\n" + trapsText));
    assert.match(sha256("x"), /^sha256:[0-9a-f]{64}$/);
  });

  test("validate rejects invalid JSON without exposing content", () => {
    const file = write("bad.json", "{invalid json with SECRET-STEM-DATA}");
    const r = run("validate", file);
    assert.equal(r.status, 1);
    assert.match(r.stdout + r.stderr, /FAIL not-json/);
    assert.doesNotMatch(r.stdout + r.stderr, /SECRET/);
  });

  test("validate reports an unreadable file", () => {
    const r = run("validate", path.join(root, "missing.json"));
    assert.equal(r.status, 1);
    assert.equal(r.stdout.trim(), "FAIL unreadable");
  });

  test("validate prints the summary for a good bank", () => {
    const r = run("validate", write("good.json", bank()));
    assert.equal(r.status, 0);
    const lines = r.stdout.trim().split("\n");
    assert.equal(lines[0], "items 12 · facts 0");
    assert.match(lines[1], /^keys A3 B3 C3 D3$/);
    assert.match(lines[2], /^objectives 0:2 1:3 2:3 3:2 4:2$/);
  });

  test("validate prints FAIL lines with rule, item id and path only", () => {
    const b = bank();
    b.items[0] = item(1, { factRefs: ["missing"] });
    const r = run("validate", write("fail.json", b));
    assert.equal(r.status, 1);
    assert.match(r.stdout, /^FAIL fact-ref t1-06-i01$/m);
    const s = write("schema.json", { meta: {}, facts: [], items: "nope" });
    assert.match(run("validate", s).stdout, /^FAIL schema @meta\.promptFile$/m);
  });

  test("validate runs when the script is invoked through a symlink", () => {
    const link = path.join(root, "bank-link.mjs");
    fs.symlinkSync(SCRIPT, link);
    const file = write("symlink-schema.json", { meta: {}, facts: [], items: "nope" });
    const r = spawnSync(process.execPath, [link, "validate", file], { encoding: "utf8", cwd: root });
    assert.equal(r.status, 1);
    assert.match(r.stdout, /^FAIL schema /m);
  });

  test("missing bank path prints usage and exits 2", () => {
    const r = run("validate");
    assert.equal(r.status, 2);
    assert.match(r.stdout + r.stderr, /usage/);
  });

  test("stamp without a meta object fails", () => {
    const file = write("nometa.json", { items: [] });
    const r = run("stamp", file, "test-model");
    assert.equal(r.status, 1);
    assert.match(r.stdout, /FAIL no-meta/);
  });

  test("stamp writes current hashes, date and model with a trailing newline", () => {
    const file = write("stamp.json", bank());
    const r = run("stamp", file, "claude-test");
    assert.equal(r.status, 0);
    const text = fs.readFileSync(file, "utf8");
    assert.ok(text.endsWith("\n"));
    assert.ok(text.includes('\n  "meta": {'));
    const { meta } = JSON.parse(text);
    assert.equal(meta.gatesHash, sha256(gatesText + "\n" + trapsText));
    assert.equal(meta.promptHash, sha256(promptText));
    assert.equal(meta.builtAt, new Date().toISOString().slice(0, 10));
    assert.equal(meta.model, "claude-test");
    assert.equal(bankStatus(root, file), "ok");
  });

  test("status is ok for a current bank", () => {
    const file = write("ok.json", bank(undefined, currentMeta()));
    const r = run("status", file);
    assert.equal(r.status, 0);
    assert.equal(r.stdout.trim(), "ok");
  });

  test("status is stale-prompt when the prompt hash differs", () => {
    const file = write("sp.json", bank(undefined, { ...currentMeta(), promptHash: "sha256:old" }));
    const r = run("status", file);
    assert.equal(r.status, 0);
    assert.equal(r.stdout.trim(), "stale-prompt");
  });

  test("status is stale-gates when the gates hash differs", () => {
    const file = write("sg.json", bank(undefined, { ...currentMeta(), gatesHash: "sha256:old" }));
    const r = run("status", file);
    assert.equal(r.status, 0);
    assert.equal(r.stdout.trim(), "stale-gates");
  });

  test("status prefers stale-prompt over stale-gates", () => {
    const file = write("both.json", bank());
    assert.equal(bankStatus(root, file), "stale-prompt");
  });

  test("status is absent when the prompt file is unreadable", () => {
    const file = write("np.json", bank(undefined, { ...currentMeta(), promptFile: "prompts/nope.md" }));
    assert.equal(bankStatus(root, file), "absent");
  });

  test("status is stale-gates when the gates files are unreadable", () => {
    const other = fs.mkdtempSync(path.join(os.tmpdir(), "bank-test-nogates-"));
    try {
      fs.mkdirSync(path.join(other, "prompts/tier1"), { recursive: true });
      fs.writeFileSync(path.join(other, PROMPT_FILE), promptText);
      const file = path.join(other, "b.json");
      fs.writeFileSync(file, JSON.stringify(bank(undefined, { promptHash: sha256(promptText) })));
      assert.equal(bankStatus(other, file), "stale-gates");
    } finally {
      fs.rmSync(other, { recursive: true, force: true });
    }
  });

  test("status is absent for a missing file, malformed JSON, or a rule-failing bank", () => {
    assert.equal(run("status", path.join(root, "nope.json")).stdout.trim(), "absent");
    assert.equal(run("status", write("mal.json", "{SECRET-oops")).stdout.trim(), "absent");
    const b = bank(Array.from({ length: 3 }, (_, i) => item(i + 1)), currentMeta());
    const r = run("status", write("rules.json", b));
    assert.equal(r.status, 0);
    assert.equal(r.stdout.trim(), "absent");
  });

  test("no CLI output contained item text", () => {
    assert.ok(outputs.length > 0);
    for (const out of outputs) assert.doesNotMatch(out, /SECRET/);
  });
});

function keyed(n, answerKey, objective) {
  return item(n, {
    objective,
    answerKey,
    autopsy: KEYS.filter((k) => k !== answerKey).map((option) => ({
      option,
      tempting: `SECRET-TEMPTING-${n}`,
      ruledOutBy: `SECRET-RULED-OUT-${n}`,
    })),
  });
}

const objectivesOf = (items) => items.map((i) => i.objective);
const keysOf = (items) => items.map((i) => i.answerKey);

describe("pickItems", () => {
  test("spreads a pick across objectives the bank order would repeat", () => {
    const items = Array.from({ length: 12 }, (_, i) => item(i + 1, { objective: Math.floor(i / 3) }));
    const { items: picked } = pickItems(items, new Set(), 3);
    assert.equal(new Set(objectivesOf(picked)).size, 3);
  });

  test("keeps a pick inside the key-position gate when the bank order would break it", () => {
    const items = [
      ...[1, 2, 3, 4].map((n) => keyed(n, "A", n)),
      ...[5, 6, 7, 8, 9, 10, 11, 12].map((n) => keyed(n, KEYS[1 + (n % 3)], n)),
    ];
    const keys = keysOf(pickItems(items, new Set(), 4).items);
    assert.equal(keys.length, 4);
    assert.ok(keys.filter((k) => k === "A").length <= 2);
    assert.ok(new Set(keys).size >= 3);
  });

  test("still returns a full pick when no subset can pass the key-position gate", () => {
    const items = [1, 2, 3, 4].map((n) => keyed(n, "A", n));
    assert.equal(pickItems(items, new Set(), 4).items.length, 4);
  });

  const extremeIsKey = (it, longest) => {
    const lens = it.question.options.map((o) => o.text.length);
    const target = longest ? Math.max(...lens) : Math.min(...lens);
    return it.question.options.find((o) => o.text.length === target).key === it.answerKey;
  };
  const lengthOverride = (n) => {
    const key = KEYS[n % 4];
    if (n <= 3) return { [key]: "L".repeat(110) };
    if (n <= 6) return { [key]: "S".repeat(90) };
    return {};
  };

  test("keeps a pick inside the key-length caps when the bank order would break them", () => {
    const items = Array.from({ length: 12 }, (_, i) => ({ ...withOptions(i + 1, KEYS[(i + 1) % 4], lengthOverride(i + 1)), objective: i }));
    for (const k of [3, 6]) {
      const picked = pickItems(items, new Set(), k).items;
      const cap = Math.ceil(k / 3);
      assert.equal(picked.length, k);
      assert.ok(picked.filter((it) => extremeIsKey(it, true)).length <= cap, `longest cap at k=${k}`);
      assert.ok(picked.filter((it) => extremeIsKey(it, false)).length <= cap, `shortest cap at k=${k}`);
    }
  });

  test("still returns a full pick when no subset can pass the key-length caps", () => {
    const items = [1, 2, 3].map((n) => ({ ...withOptions(n, KEYS[n % 4], { [KEYS[n % 4]]: "L".repeat(110) }), objective: n }));
    assert.equal(pickItems(items, new Set(), 3).items.length, 3);
  });

  test("never picks a seen item and reports the shortfall", () => {
    const items = Array.from({ length: 12 }, (_, i) => item(i + 1));
    const seen = new Set(items.slice(0, 10).map((i) => i.id));
    const { items: picked, short } = pickItems(items, seen, 5);
    assert.deepEqual(picked.map((i) => i.id).sort(), ["t1-06-i11", "t1-06-i12"]);
    assert.equal(short, 3);
  });
});

describe("pick and key", () => {
  let root;
  const promptText = "prompt body\n";
  const BANK = "banks/tier1/06-x.json";
  const SEEN = "learner/seen-items.jsonl";

  before(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "bank-pick-test-"));
    fs.mkdirSync(path.join(root, "prompts/tier1"), { recursive: true });
    fs.mkdirSync(path.join(root, ".agents/docs"), { recursive: true });
    fs.mkdirSync(path.join(root, "banks/tier1"), { recursive: true });
    fs.writeFileSync(path.join(root, PROMPT_FILE), promptText);
    fs.writeFileSync(path.join(root, ".agents/docs/GATES.md"), "gates\n");
    fs.writeFileSync(path.join(root, ".agents/docs/TRAPS.md"), "traps\n");
  });

  after(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  function run(...args) {
    return spawnSync(process.execPath, [SCRIPT, ...args], {
      encoding: "utf8",
      env: { ...process.env, BANK_REPO_ROOT: root },
    });
  }

  function writeBank(meta = {}) {
    const b = bank(undefined, { promptHash: promptHashOf(root, PROMPT_FILE), gatesHash: gatesHashOf(root), ...meta });
    fs.writeFileSync(path.join(root, BANK), JSON.stringify(b));
  }

  function resetSeen(lines) {
    const file = path.join(root, SEEN);
    fs.rmSync(file, { force: true });
    if (lines !== undefined) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, lines.map((id) => JSON.stringify({ id, date: "2026-10-01" }) + "\n").join(""));
    }
  }

  const seenIds = () =>
    fs
      .readFileSync(path.join(root, SEEN), "utf8")
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l).id);

  const pickedIds = (stdout) => [...stdout.matchAll(/^=== (\S+)$/gm)].map((m) => m[1]);

  test("pick prints ids, stems and options and nothing else from the item", () => {
    writeBank();
    resetSeen();
    const r = run("pick", PROMPT_FILE, "--n", "1");
    assert.equal(r.status, 0);
    const [id] = pickedIds(r.stdout);
    const n = Number(id.slice(-2));
    const expected = [
      "bank ok · 1 items · short 0",
      "",
      `=== ${id}`,
      `SECRET-STEM-${n}`,
      ...KEYS.map((k) => `${k}. SECRET-OPTION-${n}-${k}`),
      "",
    ].join("\n");
    assert.equal(r.stdout, expected);
  });

  test("pick output never carries a key, autopsy, audit or trap family", () => {
    writeBank();
    resetSeen();
    const r = run("pick", PROMPT_FILE, "--n", "5");
    assert.equal(pickedIds(r.stdout).length, 5);
    assert.doesNotMatch(r.stdout, /SECRET-(TEMPTING|RULED-OUT|AUDIT|TRAP)|answerKey|\bkey\b/i);
  });

  test("pick falls back with one reason line and no item text when the bank is unusable", () => {
    resetSeen();
    fs.rmSync(path.join(root, BANK), { force: true });
    assert.equal(run("pick", PROMPT_FILE).stdout, "fallback absent\n");
    writeBank({ promptHash: "sha256:old" });
    assert.equal(run("pick", PROMPT_FILE).stdout, "fallback stale-prompt\n");
    writeBank({ gatesHash: "sha256:old" });
    assert.equal(run("pick", PROMPT_FILE).stdout, "fallback stale-gates\n");
    assert.equal(run("pick", "prompts/tier1/99-none.md").stdout, "fallback absent\n");
  });

  test("pick treats a missing or empty seen file as nothing seen", () => {
    writeBank();
    resetSeen();
    const missing = run("pick", PROMPT_FILE, "--n", "12");
    resetSeen([]);
    const empty = run("pick", PROMPT_FILE, "--n", "12");
    assert.equal(missing.status, 0);
    assert.equal(pickedIds(missing.stdout).length, 12);
    assert.equal(empty.stdout, missing.stdout);
  });

  test("pick skips seen items and reports the shortfall", () => {
    writeBank();
    const all = bank().items.map((i) => i.id);
    resetSeen(all.slice(0, 10));
    const r = run("pick", PROMPT_FILE, "--n", "5");
    assert.deepEqual(pickedIds(r.stdout).sort(), all.slice(10));
    assert.match(r.stdout, /^bank ok · 2 items · short 3$/m);
  });

  test("pick never writes the seen file", () => {
    writeBank();
    resetSeen();
    run("pick", PROMPT_FILE, "--n", "5");
    assert.equal(fs.existsSync(path.join(root, SEEN)), false);
  });

  test("key prints keys and autopsies for the requested ids only", () => {
    writeBank();
    resetSeen();
    const r = run("key", "t1-06-i02", "t1-06-i05");
    assert.equal(r.status, 0);
    assert.match(r.stdout, /^=== t1-06-i02 · key C$/m);
    assert.match(r.stdout, /^=== t1-06-i05 · key B$/m);
    assert.match(r.stdout, /SECRET-TEMPTING-2\b/);
    assert.match(r.stdout, /SECRET-RULED-OUT-5\b/);
    const others = [...r.stdout.matchAll(/SECRET-[A-Z-]+-(\d+)/g)].map((m) => m[1]);
    assert.deepEqual([...new Set(others)].sort(), ["2", "5"]);
  });

  test("key marks exactly the requested ids as seen", () => {
    writeBank();
    resetSeen();
    run("key", "t1-06-i02", "t1-06-i05");
    assert.deepEqual(seenIds(), ["t1-06-i02", "t1-06-i05"]);
    const line = JSON.parse(fs.readFileSync(path.join(root, SEEN), "utf8").split("\n")[0]);
    assert.equal(line.date, new Date().toISOString().slice(0, 10));
  });

  test("key rejects an unknown id, names it, and writes nothing", () => {
    writeBank();
    resetSeen(["t1-06-i01"]);
    const r = run("key", "t1-06-i02", "t1-06-i77");
    assert.equal(r.status, 1);
    assert.match(r.stdout, /^FAIL unknown-id t1-06-i77$/m);
    assert.doesNotMatch(r.stdout, /SECRET/);
    assert.deepEqual(seenIds(), ["t1-06-i01"]);
    assert.equal(run("key", "t1-07-i01").status, 1);
  });

  test("key leaves one seen entry per id however often it runs", () => {
    writeBank();
    resetSeen();
    run("key", "t1-06-i03");
    run("key", "t1-06-i03", "t1-06-i03");
    assert.deepEqual(seenIds(), ["t1-06-i03"]);
  });

  test("seen items drop out of the next pick", () => {
    writeBank();
    resetSeen();
    const first = pickedIds(run("pick", PROMPT_FILE, "--n", "3").stdout);
    run("key", ...first);
    const second = pickedIds(run("pick", PROMPT_FILE, "--n", "3").stdout);
    assert.equal(second.length, 3);
    assert.equal(second.filter((id) => first.includes(id)).length, 0);
  });
});
