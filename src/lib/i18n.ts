import { derived, writable } from "svelte/store";
import { translations } from "./translations";

export const locale = writable("en");
export const locales = Object.keys(translations);

function translate(locale: string, key: string): string {
    const localeTranslations = translations[locale];
    if (!localeTranslations) throw new Error(`No translations found for locale "${locale}"`);

    const translation = localeTranslations[key];
    if (!translation) throw new Error(`No translation found for ${locale}.${key}`);

    return translation;
}

export const t = (lang: string, key: string) => {
    return translate(lang, key);
};