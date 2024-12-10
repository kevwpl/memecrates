import { translations } from "./translations";

export type localeType = {
    lang: string
}

export const locale = $state({lang: "en"});
export const locales = Object.keys(translations);

function translate(key: string): string {
    const localeTranslations = translations[locale.lang];
    if (!localeTranslations) throw new Error(`No translations found for locale "${locale}"`);
    const translation = localeTranslations[key];
    if (!translation) throw new Error(`No translation found for ${locale.lang}.${key}`);

    return translation;
}

export const t = (key: string) => {
    return translate(key);
};