import { rnd } from "./utils/random.js";

type AnyRec = Record<string, any>;

const KEY_HINTS: Array<[RegExp, () => any]> = [
  [/^(id|.*Id|.*ID)$/, () => rnd.idLike()],
  [/^(uuid|.*Uuid|.*UID)$/i, () => rnd.uuidLike()],
  [/^(name|fullName)$/i, () => rnd.fullName()],
  [/^first(Name)?$/i, () => rnd.fullName().split(" ")[0]],
  [/^last(Name)?$/i, () => rnd.fullName().split(" ")[1] ?? "Yılmaz"],
  [/^(email|mail)$/i, () => rnd.email()],
  [/^(phone|tel|gsm)$/i, () => rnd.phoneTR()],
  [/^(title|header|subject)$/i, () => rnd.sentence()],
  [/^(desc|description|body|content|text)$/i, () => rnd.paragraph()],
  [/^(url|link|href)$/i, () => rnd.urlLike()],
  [/^(createdAt|updatedAt|date|timestamp)$/i, () => rnd.dateISO()],
];

function fromKeyHint(key: string): any | undefined {
  for (const [re, gen] of KEY_HINTS) {
    if (re.test(key)) return gen();
  }
}

export function mockFromSample(sample: any): any {
  if (sample === null || sample === undefined) return sample;

  if (Array.isArray(sample)) {
    const base = sample.length ? sample[0] : {};
    const count = Math.min(3, Math.max(1, sample.length || 3));
    return Array.from({ length: count }, () => mockFromSample(base));
  }

  switch (typeof sample) {
    case "string": {
      // heuristics for string content
      if (/^\d{4}-\d{2}-\d{2}T/.test(sample)) return rnd.dateISO();
      if (/^[\w.-]+@[\w.-]+$/.test(sample)) return rnd.email();
      if (/^https?:\/\//.test(sample)) return rnd.urlLike();
      if (sample.length <= 20) return rnd.words(2);
      return rnd.sentence();
    }
    case "number": return rnd.int(0, Math.max(1, Math.floor(sample) || 9999));
    case "boolean": return rnd.bool();
    case "object": {
      const out: AnyRec = {};
      for (const [k, v] of Object.entries(sample as AnyRec)) {
        const hinted = fromKeyHint(k);
        out[k] = hinted !== undefined ? hinted : mockFromSample(v);
      }
      return out;
    }
    default:
      return sample;
  }
}