import fr from '../locales/fr.json'

export type Locale = 'fr'

type Translations = Record<string, string>

const translations: Record<Locale, Translations> = {
  fr,
}

export function t(key: string, locale: Locale): string {
  return translations[locale][key] ?? key
}
