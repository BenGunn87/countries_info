export interface ICountry {
    alpha3Code: string;
    name: string;
    population: number;
    flag: string;
    capital: string;
    borders: string[];
}

export interface IKeyValue {
    key: string,
    value: string
}

export interface ILangLabels {
    translation: {[identifier: string]: string},
    name: string
}

export interface IDictionary {
    en: ILangLabels,
    ru: ILangLabels,
    fr: ILangLabels,
}