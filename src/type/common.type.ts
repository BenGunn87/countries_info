export interface ICountry {
    name: string;
    population: number;
    flag: string;
    capital: string;
}

export interface ILangLabels {
    translation: {[identifier: string]: string}
}
export enum Language {
    'ru' = 'Русский',
    'en' = 'Английский',
}