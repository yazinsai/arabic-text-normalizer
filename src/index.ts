export interface NormalizeOptions {
  /** Remove harakat/tashkeel diacritics (default: true) */
  diacritics?: boolean;
  /** Remove Quranic markers like sajdah, rub el hizb (default: true) */
  markers?: boolean;
  /** Remove verse numbers and their brackets (default: true) */
  verseNumbers?: boolean;
  /** Remove tatweel/kashida elongation (default: true) */
  tatweel?: boolean;
  /** Remove small/superscript letters (default: true) */
  smallLetters?: boolean;
  /** Remove punctuation like periods, commas, semicolons (default: true) */
  punctuation?: boolean;
  /** Collapse multiple whitespace to single space (default: true) */
  collapseWhitespace?: boolean;
  /**
   * Strip hamza carriers entirely (default: false)
   *
   * Aggressively normalizes for Uthmani ↔ common Arabic matching:
   * - Removes hamza carriers (أ إ ئ ء) and converts ؤ→و
   * - Normalizes alef maqsura (ى→ي) and Farsi yeh (ی→ي)
   * - Normalizes Uthmani spelling variants (الصلوة→الصلاة)
   *
   * Examples:
   * - يسألونك → يسلونك (matches Uthmani يَسْـَٔلُونَكَ)
   * - يؤوده → يوده (matches Uthmani يَـُٔودُهُ)
   * - بشيء → بشي (matches Uthmani بِشَىْءٍ after ى→ي)
   */
  stripHamza?: boolean;
}

// Arabic tashkeel/harakat: U+064B-U+065F (includes shadda U+0651)
const DIACRITICS = /[\u064B-\u065F]/g;

// Alif with madda above (آ U+0622) -> plain alif (ا U+0627)
const ALIF_MADDA = /\u0622/g;

// Alif wasla (ٱ U+0671) -> plain alif (ا U+0627)
const ALIF_WASLA = /\u0671/g;

// Alif variants: U+0672 (wavy hamza above), U+0673 (wavy hamza below) -> plain alif
const ALIF_VARIANTS = /[\u0672\u0673]/g;

// Superscript alif (ٰ U+0670) -> plain alif (ا U+0627)
const SUPERSCRIPT_ALIF = /\u0670/g;

// Farsi/Urdu yeh variants -> Arabic yeh (ي U+064A)
// ی (U+06CC Farsi yeh), ے (U+06D2 yeh barree) are common in LLM output
const FARSI_YEH = /[\u06CC\u06D2]/g;

// Farsi/Urdu kaf (ک U+06A9) -> Arabic kaf (ك U+0643)
const FARSI_KAF = /\u06A9/g;

// Quranic annotation marks: U+06D6-U+06ED
const QURANIC_ANNOTATIONS = /[\u06D6-\u06ED]/g;

// Small letters (superscript): small high letters used in Quranic text
// U+06E5 (small waw), U+06E6 (small ya), etc. are in QURANIC_ANNOTATIONS range

// End of ayah U+06DD, start of rub el hizb U+06DE, place of sajdah U+06E9
// These are included in QURANIC_ANNOTATIONS range (U+06D6-U+06ED)

// Tatweel/kashida: U+0640
const TATWEEL = /\u0640/g;

// Ornate parentheses: U+FD3E, U+FD3F
const ORNATE_PARENS = /[\uFD3E\uFD3F]/g;

// Arabic-Indic digits: U+0660-U+0669
// Extended Arabic-Indic digits: U+06F0-U+06F9
const ARABIC_DIGITS = /[\u0660-\u0669\u06F0-\u06F9]/g;

// Common punctuation: periods, commas, colons, semicolons, exclamation, question marks, ellipsis
// Arabic comma U+060C, Arabic semicolon U+061B, Arabic question mark U+061F
const PUNCTUATION = /[.,;:!?…\u060C\u061B\u061F]/g;

// Multiple whitespace
const MULTI_WHITESPACE = /\s+/g;

// Hamza forms that should be stripped to match Uthmani behavior:
// أ (U+0623) alef-hamza above - Uthmani uses floating hamza on tatweel
// إ (U+0625) alef-hamza below - Uthmani uses floating hamza on tatweel
// ئ (U+0626) ya-hamza - Uthmani uses floating hamza on previous ya
// ء (U+0621) standalone hamza
// Note: ؤ (U+0624) is NOT stripped - it's represented the same in both common and Uthmani Arabic
const HAMZA_TO_STRIP = /[\u0621\u0623\u0625\u0626]/g;

// Alef maqsura (ى U+0649) -> ya (ي U+064A) when stripHamza is true
const ALEF_MAQSURA = /\u0649/g;

// Uthmani spelling equivalents - normalize to modern Arabic form
// These are archaic Quranic spellings that differ from modern standard Arabic:
// - الصلوة/الصلاة (prayer) - Uthmani uses waw before taa marbuta
// - الزكوة/الزكاة (charity) - Uthmani uses waw before taa marbuta
// - الحيوة/الحياة (life) - Uthmani uses waw before taa marbuta
// Pattern: وة or واة → اة (واة appears when superscript alef ٰ was already converted to alef)
const UTHMANI_WAW_TA = /وا?ة/g;

// Double ya in modern Arabic vs single ya in Uthmani
// النبيين (modern) vs النبين (Uthmani)
// This pattern catches يي sequences
const DOUBLE_YA = /يي/g;

const DEFAULT_OPTIONS: Required<NormalizeOptions> = {
  diacritics: true,
  markers: true,
  verseNumbers: true,
  tatweel: true,
  smallLetters: true,
  punctuation: true,
  collapseWhitespace: true,
  stripHamza: false,
};

/**
 * Normalize Arabic/Quranic text by removing diacritics, markers, and decorative characters.
 *
 * @param text - The Arabic text to normalize
 * @param options - Normalization options (all default to true for full normalization)
 * @returns Normalized plain Arabic text
 *
 * @example
 * ```ts
 * import { normalize } from 'arabic-text-normalizer';
 *
 * // Full normalization (default)
 * normalize('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ');
 * // => 'بسم الله الرحمن الرحيم'
 *
 * // Keep diacritics
 * normalize('بِسْمِ', { diacritics: false });
 * // => 'بِسْمِ'
 * ```
 */
export function normalize(text: string, options: NormalizeOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let result = text;

  if (opts.diacritics) {
    // Strip all diacritics (tashkeel) including shadda
    result = result.replace(DIACRITICS, "");
    result = result.replace(ALIF_MADDA, "\u0627"); // آ -> ا
    result = result.replace(ALIF_WASLA, "\u0627"); // ٱ -> ا
    result = result.replace(ALIF_VARIANTS, "\u0627"); // ٲ ٳ -> ا
    // Strip superscript alef when preceded by regular alef (LLMs write اٰ
    // but Uthmani has ـٰ; without this, اٰ→اا while ـٰ→ا after tatweel strip)
    result = result.replace(/\u0627\u0670/g, "\u0627"); // اٰ -> ا
    result = result.replace(SUPERSCRIPT_ALIF, "\u0627"); // remaining ٰ -> ا
    // Normalize Farsi/Urdu character variants
    result = result.replace(FARSI_YEH, "\u064A"); // ی ے -> ي
    result = result.replace(FARSI_KAF, "\u0643"); // ک -> ك
  }

  if (opts.markers || opts.smallLetters) {
    // QURANIC_ANNOTATIONS includes both markers and small letters
    result = result.replace(QURANIC_ANNOTATIONS, "");
  }

  if (opts.verseNumbers) {
    result = result.replace(ORNATE_PARENS, "");
    result = result.replace(ARABIC_DIGITS, "");
  }

  if (opts.tatweel) {
    result = result.replace(TATWEEL, "");
  }

  if (opts.punctuation) {
    result = result.replace(PUNCTUATION, "");
  }

  if (opts.stripHamza) {
    // Strip hamza forms that are represented differently in Uthmani
    // (أ إ ئ ء are stripped; ؤ is preserved as it's the same in both)
    result = result.replace(HAMZA_TO_STRIP, "");
    // Normalize alef maqsura to ya for consistent matching
    result = result.replace(ALEF_MAQSURA, "\u064A"); // ى -> ي
    // Normalize Uthmani spelling variants to modern form
    // الصلوة → الصلاة, الزكوة → الزكاة, الزكواة → الزكاة
    result = result.replace(UTHMANI_WAW_TA, "اة"); // وة/واة → اة
    // Normalize double ya to single ya (النبيين → النبين)
    result = result.replace(DOUBLE_YA, "ي");
    // Collapse definite-article double-lam to match Uthmani لّ encoding
    // LLM writes بالليل (2 lams), Uthmani بٱلّيل normalizes to باليل (1 lam)
    result = result.replace(/([ا])لل/g, "$1ل");
  }

  if (opts.collapseWhitespace) {
    result = result.replace(MULTI_WHITESPACE, " ").trim();
  }

  return result;
}

export default normalize;
