---
title: "Comparing AI for Long Document Summaries: Why a Smooth Summary Is Still Risky"
date: "2026-09-24"
description: "When summarizing reports and contracts with AI, how to compare and verify input length, citation accuracy and hallucination."
tags: ["AI tools", "comparison", "documents", "work automation"]
categories: ["ai-tools"]
---

AI summaries save reading time. The problem is that **a wrong summary is also smooth**. If content that is not in the original is mixed in naturally, the reader has a hard time noticing. So summary tools should be compared on **verifiability** rather than "quality".

## Three reasons a summary is risky

1. **Omission** — an important clue or an exception clause disappears
2. **Distortion** — a condition ("in the case of…") vanishes and becomes an assertion
3. **Hallucination** — numbers or names appear that are not in the original

In contracts, settlement documents and policy texts, these three turn directly into losses. A summary should be **an entry point, not a substitute for judgment**.

## Criterion 1: input length and truncation

Long documents are handled differently by each tool.

- How much can be entered at once (in tokens)
- If it is too long, does it **split** it or drop part of it
- When splitting, does it carry the context across

When a document is cut into pieces, errors appear at **the joins between pieces**. "A condition that has to be read together with chapters 1 and 5" is the typical case.

## Criterion 2: citation and evidence

This is the most important criterion.

- Does it mark the **position in the original** (page, paragraph)
- Is the marked position actually correct
- Does it honestly answer "this is not in the document"

Without citations there is no ground for trusting a summary. You have to be able to compare it with the original by eye.

## Criterion 3: handling numbers

Numbers are the most dangerous.

- Are amounts, ratios and dates carried over unchanged
- Are units and currencies left alone
- When calculating totals and rates, does it **explain the steps**

Whenever numbers appear, compare them with the original. Check an automatic total by hand once more.

## Criterion 4: length and format control

The same document should be summarized differently depending on the purpose.

- Three lines / one paragraph / a table
- Centered on decisions, owners and deadlines
- Centered on risks and exceptions

Saving the instruction and reusing it reduces variation. See [the AI prompt logbook](/en/p/ai-prompt-logbook).

## Criterion 5: data boundaries

Contracts and HR documents are bundles of sensitive information. Check before entering a document:

- Is it used for training and can that be turned off
- How long is it retained
- Are admin control and deletion possible

The criteria are in [handling personal data in AI work](/en/p/privacy-in-ai-work).

## Different handling by document type

| Document | What matters in the summary | Watch for |
|---|---|---|
| Contract | Conditions, exceptions, deadlines | Omitted conditions, distortion into assertions |
| Report | Conclusions, grounds, figures | Fabricated figures |
| Meeting notes | Decisions, owners, deadlines | Speaker confusion |
| Policy, manual | Procedure, exceptions | Omitted clauses |
| Papers, data | Claims, limits | Distorted sources |

Keeping **separate instructions and verification items** per document type makes this fast.

## A three-step verification procedure

1. **Summary first** — take it in three lines
2. **Check the evidence** — confirm the marked positions in the original
3. **Re-check numbers and proper nouns** — with a calculator and the original

This procedure works well together with [a verification procedure so you do not use AI output as is](/en/p/ai-output-verification).

## Common mistakes

- Mistaking smooth sentences for proof of accuracy
- Reporting a summary as it is even though the tool has no citations
- Summarizing a document that was cut into pieces
- Not checking arithmetic
- Entering a sensitive document without a security review

## Checklist

- [ ] Checked input length and truncation behavior
- [ ] Confirmed it can mark citations and evidence
- [ ] Set a procedure for checking numbers
- [ ] Saved separate instructions per document type
- [ ] Confirmed data boundaries

Criteria for choosing a summary tool continue in [7 criteria for choosing AI and SaaS tools](/en/p/ai-tool-selection-scorecard), and the broader comparison in [work AI compared](/en/p/ai-assistant-comparison-ko).