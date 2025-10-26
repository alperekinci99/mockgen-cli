#!/usr/bin/env node
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { mockFromSample } from "./mockFromSample.js";

// simple arg parse: --key value / flags
function parseArgs(argv: string[]) {
  const out: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        out[key] = true;
      } else {
        out[key] = next;
        i++;
      }
    }
  }
  return out;
}

async function readJsonSource(src?: string): Promise<any> {
  if (!src) throw new Error("--url veya --from-json gerekli");
  if (src.startsWith("@")) {
    const p = src.slice(1);
    const raw = await fs.readFile(p, "utf8");
    return JSON.parse(raw);
  }
  // else: fetch from URL (Node 18 global fetch)
  const u = new URL(src);
  const res = await fetch(u, { method: "GET" });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${u.toString()} — body: ${text.slice(0, 120)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Response is not valid JSON. First 120 chars: ${text.slice(0, 120)}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  // usage
  if (!(args.url || args["from-json"])) {
    console.log(`mockgen-cli
Generate mock JSON from a live endpoint or a sample file.

Usage:
  mockgen-cli --url <endpoint> [--count 5] [--out mocks.json]
  mockgen-cli --from-json @sample.json [--count 5] [--out mocks.json]

Options:
  --url <url>           Fetch sample JSON from URL
  --from-json @file     Use a local sample JSON file (prefix with @)
  --count <n>           Number of mock items (default: 3 if array, 1 if object)
  --out <file>          Output file (default: mocks.json)
  --pretty              Pretty-print JSON
`);
    process.exit(1);
  }

  const source = (args.url as string) ?? (args["from-json"] as string);
  const sample = await readJsonSource(source);

  const count = Number(args.count ?? NaN);
  const isArraySample = Array.isArray(sample);
  const needArray = isArraySample || Number.isFinite(count);
  const base = isArraySample ? (sample.length ? sample[0] : {}) : sample;

  let outJson: any;
  if (needArray) {
    const n = Number.isFinite(count) ? Math.max(1, Number(count)) : (isArraySample ? sample.length || 3 : 3);
    outJson = Array.from({ length: n }, () => mockFromSample(base));
  } else {
    outJson = mockFromSample(base);
  }

  const outPath = (args.out as string) ?? "mocks.json";
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  const payload = args.pretty ? JSON.stringify(outJson, null, 2) : JSON.stringify(outJson);
  await fs.writeFile(outPath, payload, "utf8");
  console.log(`✔ Mock data saved → ${outPath}`);
}

main().catch(err => {
  console.error("✖", err instanceof Error ? err.message : err);
  process.exit(1);
});