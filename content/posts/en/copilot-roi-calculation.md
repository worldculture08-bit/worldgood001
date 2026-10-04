---
title: "Calculating ROI Before Adopting a Per-User AI Tool"
date: "2026-09-22"
description: "A procedure for putting the numbers on time saved and real cost before adopting an AI tool charged per user, such as Microsoft 365 Copilot."
tags: ["AI tools", "SaaS", "comparison", "cost"]
categories: ["ai-tools", "planning"]
---

"How much is the monthly subscription" is not the question that decides adoption. The real question is **"is the time you get back for that money worth more than the fee"**. This post takes a per-user AI tool as an example and lays out how to do the arithmetic before you adopt.

## Convert the ROI into time

The first step is putting money and time in the same unit.

```
Monthly labor cost per person ≈ monthly pay ÷ monthly working hours
Value of time saved = time saved × hourly labor cost
Monthly net effect = (users × per-person value saved) − (users × per-person fee)
```

The key is **not overestimating the time saved**. The speed you feel in a demo is largely offset by verification and correction in real work.

## Step 1: pick the tasks that might get faster

Before adopting, make a list of "what will get faster". For example:

| Task | Times a day | Time each | Expected saving |
|---|---|---|---|
| Email drafts | 5 | 4 min | 1 min × 5 |
| Meeting minutes | 2 | 20 min | 8 min × 2 |
| Summarizing material | 1 | 30 min | 10 min |
| Document search | 6 | 3 min | 1 min × 6 |

This table is only a **list of hopes**. The next step cuts it down.

## Step 2: subtract verification and correction time

AI output is not used as is. The time to polish a draft, check numbers and fix what is wrong always comes on top.

```
Real saving = expected saving − (verification time + correction time + prompt writing time)
```

As experience accumulates the saving grows, but **in the first month it may be close to zero** is the safer assumption. The standard for verification itself is in [a verification procedure so you do not use AI output as is](/en/p/ai-output-verification).

## Step 3: add the hidden costs

Looking only at the subscription is not enough.

- Initial setup and admin training time
- Loss of productivity while the team gets used to it
- Work to manage accounts and permissions
- The cost of rolling back if it fails
- The time spent on [data boundary checks](/en/p/ai-tool-selection-scorecard) and security review

These costs are front-loaded and fall afterwards. So calculate on a **12-month** basis.

## Step 4: narrow down the number of users

Rolling out to everyone is almost always a loss. Start with the **10–20%** who do the most of the tasks that could get faster.

- People who write many documents a day
- People with many meetings and records
- People who repeat searches a lot

Do not include people whose work is simple, or who has nobody to verify AI results.

## Step 5: put it on one sheet

Collect the numbers on one sheet. Example (figures are placeholders):

| Item | Value |
|---|---|
| Number of users | 10 |
| Monthly fee per user | (check the official page) |
| Monthly hours saved per user | 2 |
| Hourly labor cost | (internal figure) |
| Monthly subscription cost | users × fee |
| Monthly value of saving | users × hours saved × labor cost |
| Net effect | value saved − subscription cost − hidden costs |

Prices change often, so check each service's **official pricing page** directly.

## A three-month trial and the decision rule

Run a **three-month trial** before rolling out to everyone.

1. Choose the users (10–20%).
2. Choose the measures: hours saved, reversions, error count, satisfaction.
3. Record the same items in months 1, 2 and 3.
4. Decide to continue, expand or stop.

Set the decision rule in advance — "if the saving is under one hour per person per month, we do not expand". If you set the standard later, the judgment blurs.

## Common mistakes

- Copying the demo's felt speed straight into hours saved
- Not subtracting verification and correction time
- Starting with everyone
- Signing an annual contract without a three-month trial
- Not setting a cost ceiling or an exit plan

## Checklist

- [ ] Made a list of tasks that could get faster
- [ ] Subtracted verification and correction time
- [ ] Calculated hidden costs over 12 months
- [ ] Narrowed down the users
- [ ] Set the decision rule and the period
- [ ] Wrote an exit plan

The same calculation applies to any other per-user AI or SaaS tool. Which tool to choose is covered in [7 criteria for choosing AI and SaaS tools](/en/p/ai-tool-selection-scorecard), and overlapping bills in [the AI and SaaS subscription audit](/en/p/ai-subscription-audit).