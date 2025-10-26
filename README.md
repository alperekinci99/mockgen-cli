# 🧪 mockgen-cli

Generate **realistic mock data** instantly from any JSON API response or snapshot.  
Perfect for frontend and test environments when backend APIs are unavailable.

---

## ✨ Features
- ⚡ **Zero-config** — Just provide an API URL.
- 🧩 **Two modes:**  
  - `fetch` → fetches a live API and mocks its structure  
  - `local` → uses an existing JSON snapshot
- 🎲 **Randomized data** (via built-in faker map)
- 🗂️ **Snapshot support** — Store and reuse API schemas
- 💾 **Pretty print & count** options for flexible output

---

## 🚀 Installation
```bash
npm i -D mockgen-cli
```

## 🧰 Usage

### 🔹 1️⃣ Fetch and generate mocks
Fetch data from a live API and instantly create randomized mock JSON:

```bash
npx mockgen-cli fetch \
  --url https://jsonplaceholder.typicode.com/posts/1 \
  --count 5 \
  --out mocks/posts.json \
  --pretty
```

### 🔹 2️⃣ Generate from local snapshot
Fetch data from a live API and instantly create randomized mock JSON:

```bash
npx mockgen-cli local \
  --snapshot .mockgen-cli/snapshots/posts.json \
  --count 10 \
  --out mocks/offline.json
```

## ⚙️ Options

| Option | Description | Default |
|:--------|:-------------|:----------|
| `--url <string>` | Full API URL (used in `fetch` mode) | — |
| `--snapshot <path>` | Path to a local snapshot file (used in `local` mode) | — |
| `--count <number>` | Number of mock items to generate | `1` |
| `--out <path>` | Output JSON file path | `mocks.json` |
| `--pretty` | Format JSON output with indentation for readability | `false` |

MIT © Alper Ekinci