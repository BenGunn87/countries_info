import {CountriesStore} from './CountriesStore';
import {CommonStore} from './СommonStore';

export const countriesStore = new CountriesStore();
export const commonStore = new CommonStore();

export const store = {
    countriesStore,
    commonStore,
};

