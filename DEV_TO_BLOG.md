---
title: Semver in Retrograde
published: false
tags: devchallenge, 418challenge, showdev
---

*This is a submission for the [DEV April Fools Challenge](https://dev.to/challenges/aprilfools-2026)*

## What I Built

I built **Semver in Retrograde**, an enterprise-grade dependency aura analyzer for emotionally unavailable npm projects.

You paste a `package.json`, click **Analyze my dependency aura**, and get a deeply serious executive report about your project's inner life:

- **Aura Stability**
- **Chaos Index**
- **Peer Dependency Tension**
- **Mercury Status**
- your dependency **Big 3**
- a **prophecy**
- a **lucky command**
- a screenshot-ready **share card**

It is completely unnecessary, mildly judgmental, and presented with the confidence of a boardroom dashboard that should not exist.

The joke is that it looks like an expensive internal platform, but what it actually delivers is dependency astrology.

There is also one very important standards-compliance feature: if you paste something that looks like `requirements.txt` or a `Gemfile`, the app responds with **418 I'm a teapot**.

## Demo

Live demo: [https://semver-in-retrograde.vercel.app/](https://semver-in-retrograde.vercel.app/)

Repo: [trknhr/semver-in-retrograde](https://github.com/trknhr/semver-in-retrograde)

Suggested demo flow:

1. Paste a chaotic `package.json`
2. Click **Analyze my dependency aura**
3. Show the KPI cards and the Big 3
4. Scroll to the prophecy and lucky command
5. End on the share card

## Code

The code is here:

- [GitHub Repository](https://github.com/trknhr/semver-in-retrograde)

The app is structured around a simple split:

- **deterministic local logic** for parsing and scoring the manifest
- **Gemini-generated language** for the executive reading

That means the same manifest always gets the same numeric scores, while the AI handles the polished nonsense.

## How I Built It

I built this with:

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **server-side Gemini API**
- **`@google/genai`**
- **Zod**

The architecture is intentionally overbuilt for something profoundly unhelpful.

### 1. Deterministic manifest analysis

The app parses `package.json` and extracts signals like:

- dependency counts
- `peerDependencies`
- `overrides` / `resolutions`
- wildcard and `latest` versions
- `pre*` / `post*` scripts
- `postinstall`
- package manager hints
- framework / test / build tool fingerprints

Those features are then converted into scores such as:

- **Aura Stability**
- **Chaos Index**
- **Peer Dependency Tension**
- **Boundary Issues**
- **Trust Issues**
- **Mercury in Nodegrade**

All of this is computed locally so the core behavior stays deterministic.

### 2. Gemini for the narrative layer

I used Gemini on the server to generate the parts that needed tone rather than correctness:

- executive summary
- sun / moon / rising interpretations
- red flags
- prophecy
- lucky command
- share caption

The app asks Gemini for structured JSON and validates the result with Zod before rendering it.

That let me keep the product funny without letting the model invent the actual score logic.

### 3. The UI direction

Instead of making it look like a horoscope app, I made it look like a corporate audit dashboard.

That contrast is the whole bit.

The design goal was:

**"This should look like a compliance product that got trapped in a spiritual crisis."**

### 4. The April Fools detail I care about most

If the input looks like Python or Ruby dependency files, the app returns **418**.

That part is useless, correct, and emotionally satisfying.

### 5. Eval, because the joke works better if the nonsense is measured

I did not want the AI layer to be "hope and vibes."

So I added a small `promptfoo` harness around the reading endpoint and treated the joke like a real structured-output feature.

The eval setup is split into two layers:

- **deterministic assertions** for response contract, writing constraints, and fixture-specific signal coverage
- **LLM-as-a-judge rubrics** for tone and grounding

The deterministic checks verify things like:

- the endpoint returns the full expected JSON shape
- the response stays in `live` mode for the eval fixtures
- the copy does not drift into practical engineering advice
- the `luckyCommand` still looks like a shell command
- the response actually reflects the manifest signals it was supposed to notice

Then I layered on judge-based checks for the harder-to-measure parts:

- does this still sound polished, dead-serious, and vaguely B2B?
- is it funny through sincerity rather than random nonsense?
- does it stay grounded in the fixture instead of inventing facts?

That gave me a better contract for the product:

- local code owns the real scoring logic
- Gemini owns the tone
- evals make sure those boundaries do not blur

The runner hits the local Next.js app over HTTP, so the evaluation path matches the real product path instead of testing a fake helper in isolation.

### 6. Eval results

The evaluation run I kept for this project was:

- `eval-qw8-2026-04-08T00:18:21`
- public report: [semver-in-retrograde.vercel.app/evals/eval-qw8-2026-04-08T00:18:21](https://semver-in-retrograde.vercel.app/evals/eval-qw8-2026-04-08T00:18:21)
- raw JSON: [semver-in-retrograde.vercel.app/evals/eval-qw8-2026-04-08T00-18-21.json](https://semver-in-retrograde.vercel.app/evals/eval-qw8-2026-04-08T00-18-21.json)

That run used:

- `promptfoo`
- 4 manifest fixtures
- 8 expanded test cases
- concurrency set to `1`
- light retrying around transient model-availability issues
- Gemini as the judge model

Result:

- **8 / 8 passing**
- **0 failures**
- **0 errors**
- runtime: about **133 seconds**

The fixtures cover four different dependency personalities:

- a mildly over-governed Next.js workspace
- a commitment-avoidant Vite app with `latest` and wildcard ranges
- a haunted library with overrides, resolutions, and lifecycle weirdness
- a relatively boring steady package that should not be over-dramatized

That last case was especially important. A joke product is easy to make noisy. It is harder to make it consistently funny without forcing chaos where the input does not justify it.

## Prize Category

I am submitting this for **Best Google AI Usage**.

Google AI is central to the project, not just attached to it:

- Gemini is used server-side for the executive reading layer
- the app uses structured JSON output instead of free-form text dumping
- the model output is validated before display
- the narrative layer is evaluated with both deterministic checks and LLM-as-a-judge rubrics
- the product experience is designed around the contrast between deterministic scoring and AI-generated corporate mysticism

In other words, the AI is doing exactly what it should do here. It's not critical logic, but high-quality, highly reusable nonsense.

If your JavaScript project has unresolved dependency feelings, Semver in Retrograde is ready to misinterpret them at enterprise scale.
