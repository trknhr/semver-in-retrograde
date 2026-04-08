import { readFile } from "node:fs/promises";
import path from "node:path";

export default class ReadingProvider {
  constructor(options = {}) {
    this.baseUrl = options.config?.baseUrl ?? "http://127.0.0.1:3000";
    this.route = options.config?.route ?? "/api/reading";
    this.liveRetries = options.config?.liveRetries ?? 0;
    this.retryDelayMs = options.config?.retryDelayMs ?? 0;
    this.providerId = options.id ?? "local-reading-api";
  }

  id() {
    return this.providerId;
  }

  async callApi(_prompt, context) {
    const fixturePath = context?.vars?.fixturePath;

    if (typeof fixturePath !== "string" || fixturePath.length === 0) {
      return {
        error: "fixturePath must be provided in test vars.",
      };
    }

    const absoluteFixturePath = path.resolve(process.cwd(), fixturePath);
    const manifestText = await readFile(absoluteFixturePath, "utf8");

    let lastResult;

    for (let attempt = 0; attempt <= this.liveRetries; attempt += 1) {
      const response = await fetch(`${this.baseUrl}${this.route}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          manifestText,
        }),
      });

      const rawBody = await response.text();
      let parsedBody;

      try {
        parsedBody = JSON.parse(rawBody);
      } catch {
        return {
          error: `Reading endpoint returned non-JSON output with status ${response.status}.`,
          output: rawBody,
        };
      }

      if (!response.ok) {
        return {
          error: `Reading endpoint returned HTTP ${response.status}.`,
          output: parsedBody,
        };
      }

      lastResult = {
        output: parsedBody,
        prompt: manifestText,
        metadata: {
          attempt: attempt + 1,
          fixturePath,
          httpStatus: response.status,
        },
      };

      if (!this.shouldRetry(parsedBody) || attempt === this.liveRetries) {
        return lastResult;
      }

      await new Promise((resolve) => setTimeout(resolve, this.retryDelayMs));
    }

    return lastResult;
  }

  shouldRetry(result) {
    if (result?.model?.mode !== "fallback") {
      return false;
    }

    const warning = result?.warnings?.[0];

    return (
      typeof warning === "string" &&
      /(temporarily unavailable|high demand|rate-limiting)/i.test(warning)
    );
  }
}
