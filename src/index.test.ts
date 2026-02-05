import { describe, it, expect } from "vitest";
import { normalize } from "./index";

describe("normalize", () => {
  describe("diacritics removal", () => {
    it("removes fatha, damma, kasra", () => {
      expect(normalize("بَبُبِ")).toBe("ببب");
    });

    it("removes tanween", () => {
      expect(normalize("كِتَابٌ")).toBe("كتاب");
    });

    it("removes shadda", () => {
      expect(normalize("اللَّهِ")).toBe("الله");
    });

    it("removes sukun", () => {
      expect(normalize("مِنْ")).toBe("من");
    });

    it("preserves diacritics when option is false", () => {
      expect(normalize("بِسْمِ", { diacritics: false })).toBe("بِسْمِ");
    });
  });

  describe("Quranic markers removal", () => {
    it("removes end of ayah marker", () => {
      expect(normalize("الرحيم\u06DD")).toBe("الرحيم");
    });

    it("removes rub el hizb", () => {
      expect(normalize("۞ وَإِذْ")).toBe("وإذ");
    });

    it("removes sajdah marker", () => {
      expect(normalize("text\u06E9more")).toBe("textmore");
    });

    it("preserves markers when option is false", () => {
      expect(normalize("۞", { markers: false, smallLetters: false })).toBe("۞");
    });
  });

  describe("verse numbers removal", () => {
    it("removes Arabic-Indic digits", () => {
      expect(normalize("آية ١٢٣")).toBe("اية");
    });

    it("removes ornate parentheses", () => {
      expect(normalize("﴿١﴾")).toBe("");
    });

    it("removes extended Arabic-Indic digits", () => {
      expect(normalize("۱۲۳")).toBe("");
    });

    it("preserves verse numbers when option is false", () => {
      expect(normalize("١٢٣", { verseNumbers: false })).toBe("١٢٣");
    });
  });

  describe("tatweel removal", () => {
    it("removes tatweel/kashida", () => {
      expect(normalize("اللـــه")).toBe("الله");
    });

    it("preserves tatweel when option is false", () => {
      expect(normalize("اللـه", { tatweel: false })).toBe("اللـه");
    });
  });

  describe("small letters removal", () => {
    it("converts superscript alif to plain alif", () => {
      expect(normalize("الرَّحْمَٰنِ")).toBe("الرحمان");
    });

    it("removes small waw and ya", () => {
      // U+06E5 small waw, U+06E6 small ya
      expect(normalize("test\u06E5\u06E6")).toBe("test");
    });
  });

  describe("punctuation removal", () => {
    it("removes periods and ellipsis", () => {
      expect(normalize("...كلمة...")).toBe("كلمة");
    });

    it("removes Arabic and Latin punctuation", () => {
      expect(normalize("كلمة، كلمة؛ كلمة؟")).toBe("كلمة كلمة كلمة");
    });

    it("preserves punctuation when option is false", () => {
      expect(normalize("كلمة.", { punctuation: false })).toBe("كلمة.");
    });
  });

  describe("whitespace handling", () => {
    it("collapses multiple spaces", () => {
      expect(normalize("كلمة   كلمة")).toBe("كلمة كلمة");
    });

    it("trims leading and trailing whitespace", () => {
      expect(normalize("  كلمة  ")).toBe("كلمة");
    });

    it("preserves whitespace when option is false", () => {
      expect(normalize("كلمة   كلمة", { collapseWhitespace: false })).toBe(
        "كلمة   كلمة"
      );
    });
  });

  describe("preserves distinct characters", () => {
    it("preserves different hamza forms", () => {
      expect(normalize("أ إ ؤ ئ ء")).toBe("أ إ ؤ ئ ء");
    });

    it("normalizes alif madda to plain alif", () => {
      expect(normalize("آ")).toBe("ا");
      expect(normalize("القرآن")).toBe("القران");
    });

    it("normalizes alif wasla to plain alif", () => {
      expect(normalize("ٱ")).toBe("ا");
      expect(normalize("ٱلله")).toBe("الله");
    });

    it("preserves alif maqsura distinct from ya", () => {
      expect(normalize("ى ي")).toBe("ى ي");
    });

    it("preserves teh marbuta distinct from heh", () => {
      expect(normalize("ة ه")).toBe("ة ه");
    });
  });

  describe("full normalization", () => {
    it("normalizes Basmala", () => {
      const input = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
      expect(normalize(input)).toBe("بسم الله الرحمان الرحيم");
    });

    it("normalizes verse with markers and numbers", () => {
      const input = "۞ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾";
      expect(normalize(input)).toBe("الحمد لله رب العالمين");
    });

    it("normalizes Surah Al-Hadid verse 10", () => {
      const input =
        "وَمَا لَكُمْ لَا تُنفِقُونَ فِى سَبِيلِ ٱللَّهِ وَلِلَّهِ مِيرَاثُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ ۚ لَا يَسْتَوِى مِنكُم مَّنْ أَنفَقَ قَبْلَ ٱلْفَتْحِ وَقَٰتَلَ ۚ أُو۟لَٰٓئِكَ أَعْظَمُ دَرَجَةً مِّنَ ٱلَّذِينَ أَنفَقُوا۟ مِنۢ بَعْدُ وَقَٰتَلُوا۟ ۚ وَكُلًّا وَعَدَ ٱللَّهُ ٱلْحُسْنَىٰ ۗ وَٱللَّهُ بِمَا تَعْمَلُونَ خَبِيرٌ";
      expect(normalize(input)).toBe(
        "وما لكم لا تنفقون فى سبيل الله ولله ميراث السماوات والأرض لا يستوى منكم من أنفق قبل الفتح وقاتل أولائك أعظم درجة من الذين أنفقوا من بعد وقاتلوا وكلا وعد الله الحسنىا والله بما تعملون خبير"
      );
    });

    it("normalizes Surah Al-Baqarah verse 177", () => {
      const input =
        "لَّيْسَ ٱلْبِرَّ أَن تُوَلُّوا۟ وُجُوهَكُمْ قِبَلَ ٱلْمَشْرِقِ وَٱلْمَغْرِبِ وَلَٰكِنَّ ٱلْبِرَّ مَنْءَامَنَ بِٱللَّهِ وَٱلْيَوْمِ ٱلْءَاخِرِ وَٱلْمَلَٰٓئِكَةِ وَٱلْكِتَٰبِ وَٱلنَّبِيِّۦنَ وَءَاتَى ٱلْمَالَ عَلَىٰ حُبِّهِۦ ذَوِى ٱلْقُرْبَىٰ وَٱلْيَتَٰمَىٰ وَٱلْمَسَٰكِينَ وَٱبْنَ ٱلسَّبِيلِ وَٱلسَّآئِلِينَ وَفِى ٱلرِّقَابِ";
      expect(normalize(input)).toBe(
        "ليس البر أن تولوا وجوهكم قبل المشرق والمغرب ولاكن البر منءامن بالله واليوم الءاخر والملائكة والكتاب والنبين وءاتى المال علىا حبه ذوى القربىا واليتامىا والمساكين وابن السبيل والسائلين وفى الرقاب"
      );
    });

    it("handles empty string", () => {
      expect(normalize("")).toBe("");
    });

    it("handles string with only removable characters", () => {
      expect(normalize("﴿١٢٣﴾")).toBe("");
    });
  });

  describe("options combinations", () => {
    it("can disable all normalizations", () => {
      const input = "بِسْمِ";
      const result = normalize(input, {
        diacritics: false,
        markers: false,
        verseNumbers: false,
        tatweel: false,
        smallLetters: false,
        punctuation: false,
        collapseWhitespace: false,
      });
      expect(result).toBe(input);
    });

    it("can selectively enable normalizations", () => {
      const input = "بِسْمِ  اللَّهِ";
      const result = normalize(input, {
        diacritics: true,
        collapseWhitespace: false,
      });
      expect(result).toBe("بسم  الله");
    });
  });
});
