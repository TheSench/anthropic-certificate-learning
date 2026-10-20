#!/usr/bin/env python3
"""Check drill cards for a key that can be found by its length — GATES.md gate 5.

The keyed option tends to be written carefully and the distractors as quick foils, so
the key ends up the longest option, often the only one carrying a second sentence. A
deck measured at 72% longest-option-is-key could be beaten without reading a stem.

Usage:  .agents/check-key-length.py [deck.md] [--cards D-001,D-014]
        --cards limits per-card checks to those IDs and skips the deck-wide rates.
Exit:   0 clean · 1 one or more violations · 2 nothing parsed
"""

import argparse
import math
import re
import sys
from pathlib import Path

MAX_KEY_RATIO = 1.25
SENTENCE_BREAK = re.compile(r"[.;](?=\s+\S)")


def parse(text):
    for block in re.split(r"\n### ", text)[1:]:
        card_id = re.match(r"\[(D-\d+)\]", block)
        if not card_id or "**A:**" not in block:
            continue
        question, answer = block.split("**A:**", 1)
        options, current = {}, None
        for line in question.split("\n"):
            m = re.match(r"(?:- )?([A-D])\. (.*)", line)
            if m:
                current = m.group(1)
                options[current] = m.group(2).strip()
            elif current and line.startswith("  ") and line.strip():
                options[current] += " " + line.strip()
            elif line.strip():
                current = None
        m = re.match(r"\s*([A-D](?:\s*(?:,|and|&)\s*[A-D])*)\b", answer)
        if len(options) == 4 and m:
            yield card_id.group(1), options, set(re.findall(r"[A-D]", m.group(1)))


def card_problems(options, keys):
    distractors = [v for k, v in options.items() if k not in keys]
    longest = max(len(d) for d in distractors)
    problems = []
    for k in sorted(keys):
        ratio = len(options[k]) / longest
        if ratio > MAX_KEY_RATIO:
            problems.append(f"key {k} is {ratio:.2f}x the longest distractor (max {MAX_KEY_RATIO})")
        if SENTENCE_BREAK.search(options[k]) and not any(SENTENCE_BREAK.search(d) for d in distractors):
            problems.append(f"key {k} has a second sentence or clause no distractor has")
    return problems


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("deck", nargs="?", default=Path(__file__).resolve().parent.parent / "drills/deck.md")
    ap.add_argument("--cards", help="comma-separated card IDs")
    args = ap.parse_args()
    wanted = set(args.cards.split(",")) if args.cards else None

    text = Path(args.deck).read_text()
    if not wanted and not re.search(r"^### \[D-", text, re.M):
        print("OK — deck is empty")
        return 0
    cards = list(parse(text))
    if wanted:
        cards = [c for c in cards if c[0] in wanted]
    if not cards:
        print("no cards parsed — has the card format changed?", file=sys.stderr)
        return 2

    failed = False
    for card_id, options, keys in cards:
        for p in card_problems(options, keys):
            print(f"{card_id}: {p}")
            failed = True

    if not wanted:
        n, cap = len(cards), math.ceil(len(cards) / 3)
        for label, pick in (("longest", max), ("shortest", min)):
            hits = sum(pick(o, key=lambda k: len(o[k])) in keys for _, o, keys in cards)
            over = hits > cap
            failed |= over
            print(f"{label} option is a key: {hits}/{n} (limit {cap}){'  FAIL' if over else ''}")

    print("FAIL" if failed else f"OK — {len(cards)} cards")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
