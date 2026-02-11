interface NormalizeOptions {
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
declare function normalize(text: string, options?: NormalizeOptions): string;

export { type NormalizeOptions, normalize as default, normalize };
