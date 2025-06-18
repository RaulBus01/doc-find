import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Statically import translations to ensure they are bundled
import enUS from "./locales/en-US/translation.json";
import roRO from "./locales/ro-RO/translation.json";
import frFR from "./locales/fr-FR/translation.json";
import esES from "./locales/es-ES/translation.json";
import deDE from "./locales/de-DE/translation.json";
import itIT from "./locales/it-IT/translation.json";
import ptPT from "./locales/pt-PT/translation.json";

// Define the resources object directly
const resources = {
  "en-US": { translation: enUS },
  "ro-RO": { translation: roRO },
  "fr-FR": { translation: frFR },
  "es-ES": { translation: esES },
  "de-DE": { translation: deDE },
  "it-IT": { translation: itIT },
  "pt-PT": { translation: ptPT },
};

export const initI18n = async () => {
  let savedLanguage;
  
  try {
    savedLanguage = await AsyncStorage.getItem("language");
  } catch (error) {
    console.error("Failed to get saved language:", error);
  }
  
  if (!savedLanguage) {
    try {
      savedLanguage = Localization.getLocales()[0].languageTag;
    } catch (error) {
      console.error("Failed to get device locale:", error);
      savedLanguage = "en-US"; // Fallback
    }
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    debug: __DEV__,
  });
};

export const changeLanguage = async (languageCode: string) => {
  await i18n.changeLanguage(languageCode);
  await AsyncStorage.setItem("language", languageCode);
};



export default i18n;