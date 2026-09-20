// Duplicate-key-safe JSON parsing.
//
// Extracted from release-validator.mjs on 2026-09-20. JSON.parse keeps the LAST duplicate
// key silently; for a hashed record that is the difference between one payload and a
// different payload with the SAME digest, so every validator in this kit parses through
// here instead. It also refuses a UTF-8 BOM, which JSON.parse accepts and hashing does not.
class JsonReader {
  constructor(text) { this.text = String(text); this.index = 0; }

  error(message) { throw new Error(`${message} at byte ${this.index}`); }

  whitespace() {
    while (/[\u0009\u000a\u000d\u0020]/.test(this.text[this.index] ?? '')) this.index += 1;
  }

  value() {
    this.whitespace();
    const char = this.text[this.index];
    if (char === '{') return this.object();
    if (char === '[') return this.array();
    if (char === '"') return this.string();
    if (this.text.startsWith('true', this.index)) { this.index += 4; return true; }
    if (this.text.startsWith('false', this.index)) { this.index += 5; return false; }
    if (this.text.startsWith('null', this.index)) { this.index += 4; return null; }
    const match = this.text.slice(this.index).match(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/);
    if (match) {
      this.index += match[0].length;
      const number = Number(match[0]);
      if (!Number.isFinite(number)) this.error('non-finite number');
      return number;
    }
    this.error('invalid JSON value');
  }

  string() {
    const start = this.index;
    this.index += 1;
    while (this.index < this.text.length) {
      const char = this.text[this.index];
      if (char === '\\') { this.index += 2; continue; }
      if (char === '"') {
        this.index += 1;
        try { return JSON.parse(this.text.slice(start, this.index)); } catch { this.error('invalid JSON string'); }
      }
      if (char < ' ') this.error('control character in JSON string');
      this.index += 1;
    }
    this.error('unterminated JSON string');
  }

  object() {
    this.index += 1;
    const result = {};
    const keys = new Set();
    this.whitespace();
    if (this.text[this.index] === '}') { this.index += 1; return result; }
    while (this.index < this.text.length) {
      this.whitespace();
      if (this.text[this.index] !== '"') this.error('object key must be a string');
      const key = this.string();
      if (keys.has(key)) this.error(`duplicate object key ${JSON.stringify(key)}`);
      keys.add(key);
      this.whitespace();
      if (this.text[this.index] !== ':') this.error('missing colon after object key');
      this.index += 1;
      result[key] = this.value();
      this.whitespace();
      if (this.text[this.index] === '}') { this.index += 1; return result; }
      if (this.text[this.index] !== ',') this.error('missing comma between object members');
      this.index += 1;
    }
    this.error('unterminated JSON object');
  }

  array() {
    this.index += 1;
    const result = [];
    this.whitespace();
    if (this.text[this.index] === ']') { this.index += 1; return result; }
    while (this.index < this.text.length) {
      result.push(this.value());
      this.whitespace();
      if (this.text[this.index] === ']') { this.index += 1; return result; }
      if (this.text[this.index] !== ',') this.error('missing comma between array members');
      this.index += 1;
    }
    this.error('unterminated JSON array');
  }

  parse() {
    const result = this.value();
    this.whitespace();
    if (this.index !== this.text.length) this.error('trailing JSON data');
    return result;
  }
}

export function parseJsonNoDuplicates(text) {
  const source = String(text);
  if (source.startsWith('\uFEFF')) throw new Error('UTF-8 BOM is not permitted at byte 0');
  return new JsonReader(source).parse();
}
