# arabic-text-normalizer

Normalize Quranic/Arabic text by removing diacritics, markers, and decorative characters.

## Installation

```bash
npm install arabic-text-normalizer
```

## Usage

```ts
import { normalize } from "arabic-text-normalizer";

// Full normalization (default)
normalize("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ");
// => "بسم الله الرحمن الرحيم"

normalize("۞ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾");
// => "الحمد لله رب العالمين"

// Selective normalization
normalize("بِسْمِ", { diacritics: false });
// => "بِسْمِ"
```

## Options

All options default to `true` for full normalization:

| Option | Description |
|--------|-------------|
| `diacritics` | Remove harakat/tashkeel; normalize alif madda (آ→ا) and alif wasla (ٱ→ا) |
| `markers` | Remove Quranic markers (sajdah, rub el hizb, end of ayah) |
| `verseNumbers` | Remove verse numbers and ornate brackets |
| `tatweel` | Remove tatweel/kashida elongation character |
| `smallLetters` | Remove small/superscript letters (small alif, waw, ya) |
| `punctuation` | Remove punctuation (periods, commas, colons, semicolons, Arabic punctuation) |
| `collapseWhitespace` | Collapse multiple spaces to single, trim |

## What's Preserved

- Hamza forms (أ إ ؤ ئ ء) remain distinct
- Alif maqsura (ى) vs ya (ي) remain distinct
- Teh marbuta (ة) vs heh (ه) remain distinct

## License

MIT
