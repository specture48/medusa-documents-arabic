import Cookies from "js-cookie";

export const getLanguagePreference = (ar: string, en: string) => {
  const lang = Cookies.get("lng");
  if (lang === "ar") {
    return ar;
  }
  return en;
};
