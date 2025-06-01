import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from "./locales/en-US/translation.json";
import translationRo from "./locales/ro-RO/translation.json";
import translationFr from "./locales/fr-FR/translation.json";
import translationEs from "./locales/es-ES/translation.json"; 
import translationDe from "./locales/de-DE/translation.json"; 
import translationIt from "./locales/it-IT/translation.json"; 
import translationPt from "./locales/pt-PT/translation.json"; 

const resources = {
  "en-US": { translation: translationEn },
  "ro-RO": { translation: translationRo },
  "fr-FR": { translation: translationFr },
  "es-ES": { translation: translationEs }, 
  "de-DE": { translation: translationDe },
  "it-IT": { translation: translationIt },
  "pt-PT": { translation: translationPt },

};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("language");
  
  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageTag;
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
  });
};

// Function to change language and save preference
export const changeLanguage = async (languageCode: string) => {
  await i18n.changeLanguage(languageCode);
  await AsyncStorage.setItem("language", languageCode);
};

initI18n();

export default i18n;