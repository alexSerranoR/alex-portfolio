const numerals: [number, string][] = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

// Chapters are numbered like a book; this covers the first 39.
export function roman(value: number) {
  let rest = value;
  let out = "";
  for (const [amount, symbol] of numerals) {
    while (rest >= amount) {
      out += symbol;
      rest -= amount;
    }
  }
  return out;
}
