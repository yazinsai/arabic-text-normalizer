# arabic-text-normalizer

NPM package to normalize Quranic/Arabic text by removing diacritics, markers, and decorative characters.

## Requirements

### Input/Output
- **Input**: Arabic text in Quranic format with diacritics, verse separators, extenders, markers
- **Output**: Plain Arabic text with base letters only

### Normalization Behavior

| Character Class | Behavior |
|-----------------|----------|
| Diacritics (harakat, tashkeel) | Remove |
| Verse numbers + brackets ﴿١٢٣﴾ | Remove entirely |
| Sajdah markers, rub el hizb ۞, juz markers | Remove entirely |
| Tatweel/kashida ـ | Remove |
| Small letters (ٰ small alif, small waw, small ya) | Remove |
| Hamza forms (أ إ آ ؤ ئ ء) | Keep distinct |
| Alif maqsura ى vs ya ي | Keep distinct |
| Teh marbuta ة vs heh ه | Keep distinct |
| Whitespace after removals | Collapse to single space, trim |

### API Design

Single function with options object:

```typescript
import { normalize } from 'arabic-text-normalizer';

// Full normalization (default)
normalize(text);

// With options to disable specific normalizations
normalize(text, {
  diacritics: true,      // default: true - remove harakat/tashkeel
  markers: true,         // default: true - remove Quranic markers
  verseNumbers: true,    // default: true - remove verse numbers + brackets
  tatweel: true,         // default: true - remove kashida
  smallLetters: true,    // default: true - remove superscript letters
  collapseWhitespace: true, // default: true - collapse spaces
});
```

### Technical Specs

- **Language**: TypeScript
- **Output**: ESM + CJS dual package with .d.ts types
- **Environment**: Universal (Node.js + browsers)
- **Dependencies**: Minimal (zero if possible, small utilities if needed)
- **Script handling**: Uniform - treats all Quranic text variants the same
- **Input assumption**: Pure Arabic text (no mixed language handling)

### Unicode Ranges to Handle

**Diacritics (remove):**
- U+064B-U+065F (Arabic tashkeel)
- U+0670 (superscript alif)
- U+06D6-U+06ED (Quranic annotation marks)

**Markers (remove):**
- U+06DD (end of ayah)
- U+06DE (start of rub el hizb)
- U+06E9 (place of sajdah)

**Decorative (remove):**
- U+0640 (tatweel)
- U+FD3E, U+FD3F (ornate parentheses)

**Numbers (remove):**
- U+0660-U+0669 (Arabic-Indic digits)
- U+06F0-U+06F9 (Extended Arabic-Indic digits)
