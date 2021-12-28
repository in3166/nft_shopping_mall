import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "./locales/en/translation.json";
import translationKO from "./locales/ko/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  ko: {
    translation: translationKO,
  },
};
const Languages = ["en", "ko"];
i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18ne
  .use(initReactI18next)
  .init({
    //resources: { kr, en },
    resources,
    fallbackLng: "ko",
    whitelist: Languages,
    interpolation: { escapeValue: false },
    detection: { order: ["path", "navigator"] },
  });

export default i18n;
