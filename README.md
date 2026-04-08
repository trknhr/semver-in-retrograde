This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Eval Setup

This repo includes a minimal `promptfoo` evaluation harness for the reading endpoint.
It is intentionally small but split into two layers:

- deterministic assertions for response shape, writing constraints, and fixture-specific signal coverage
- `llm-rubric` checks for tone and grounding

### Requirements

- `GEMINI_API_KEY` in `.env.local`
- a local dev server started by the eval runner

### Run

```bash
npm run eval:reading
```

The eval runner boots the Next.js app locally, hits `POST /api/reading`, and grades the resulting JSON response against the fixtures in `evals/fixtures/manifests/`.
It also loads `.env.local` into `promptfoo` itself so the `llm-rubric` grader can use the same Gemini credentials as the app under test.
By default, the judge model is `google:gemini-3.1-flash-lite-preview`.

If you want a different judge model, pass it through to promptfoo:

```bash
npm run eval:reading -- --grader openai:gpt-5-mini
```

If you want a cheaper Gemini judge, this also works:

```bash
npm run eval:reading -- --grader google:gemini-2.5-flash-lite
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
