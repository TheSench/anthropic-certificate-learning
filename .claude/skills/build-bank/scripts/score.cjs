// usage: node score.cjs <drafts.json> <solver-verdicts.json> <auditor-verdicts.json> <rewrite-out.json>
// Prints ids and reason codes only — never item text.
const fs = require("fs");
const [draftsPath, solverPath, auditorPath, rewritePath] = process.argv.slice(2);
const drafts = JSON.parse(fs.readFileSync(draftsPath, "utf8"));
const solver = new Map(JSON.parse(fs.readFileSync(solverPath, "utf8")).map((v) => [v.id, v]));
const auditor = new Map(JSON.parse(fs.readFileSync(auditorPath, "utf8")).map((v) => [v.id, v]));

const rewrite = [];
const tally = {};
let pass = 0;
for (const item of drafts) {
  const reasons = [];
  const s = solver.get(item.id);
  if (!s) reasons.push("solver-missing");
  else {
    if (s.chosen !== item.answerKey) reasons.push(`key-mismatch(solver chose ${s.chosen})`);
    const nulls = Object.entries(s.eliminations || {}).filter(([, v]) => v === null).map(([k]) => k);
    if (nulls.length) reasons.push(`distractor-dies-by-assumption(${nulls.join(",")})`);
    if (s.premiseRestated) reasons.push("premise-restated");
    if (s.missingQuantity) reasons.push("missing-quantity");
    if (s.decidable === false) reasons.push("undecidable");
  }
  const a = auditor.get(item.id);
  if (!a) reasons.push("auditor-missing");
  else if (!a.pass) reasons.push(...(a.failedGates || ["auditor-fail"]));
  for (const r of reasons) {
    const code = r.split(/[(:]/)[0].trim();
    tally[code] = (tally[code] || 0) + 1;
  }
  if (reasons.length) rewrite.push({ id: item.id, reasons });
  else pass++;
}
fs.writeFileSync(rewritePath, JSON.stringify(rewrite, null, 2));
console.log(`pass ${pass}/${drafts.length}`);
console.log(`fail-codes ${JSON.stringify(tally)}`);
for (const r of rewrite) console.log(`FAIL ${r.id}: ${r.reasons.map((x) => x.split(/[(:]/)[0].trim()).join("; ")}`);
