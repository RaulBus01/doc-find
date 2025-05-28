import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from "./locales/en-US/translation.json";
import translationRo from "./locales/ro-RO/translation.json";


const resources = {

  "en-US": { translation: translationEn },
  "ro-RO": { translation: translationRo },

};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("language");
  savedLanguage='en-US';

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageTag;
  }
  console.log("Saved language:", savedLanguage);

  i18n.use(initReactI18next).init({

    resources,
    lng: savedLanguage,
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;