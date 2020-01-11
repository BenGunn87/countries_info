import {CountriesStore} from './CountriesStore';
import {LanguageStore} from './LanguageStore';

export const countriesStore = new CountriesStore();
export const languageStore = new LanguageStore();

export const store = {
    countriesStore,
    languageStore,
};

