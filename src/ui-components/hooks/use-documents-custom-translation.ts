import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import en from "../../i18n/en.json";
import ar from "../../i18n/ar.json";

export const useDocumentsCustomTranslation = () => {
  const { i18n } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const lang = i18n.language || "en";

    const customTranslations = {
      en,
      ar,
    };

    if (!i18n.hasResourceBundle(lang, "custom-documents-translations")) {
      i18n.addResourceBundle(
        lang,
        "custom-documents-translations",
        customTranslations[lang as keyof typeof customTranslations],
        true,
        true,
      );
    }
    setLoaded(true);
  }, [i18n.language, i18n]);

  return { loaded };
};
