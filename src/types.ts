export interface LanguageName {
  official: string
  common: string
}

export interface CountryNativeNames {
  [key: string]: LanguageName
}

export interface CountryData {
  name: {
    common: string
    official: string
    nativeName: CountryNativeNames
  }
  flag: string
  population: string
  capital: string[] // Changed to string[] as capital is an array of strings
}

export type NumericInput = number | string
