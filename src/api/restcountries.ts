import {ICountry} from "../type/common.type";

const url = 'https://restcountries.eu/rest/v2';

/**
 * Функция для получения списка стран
 */
export async function getAllCountries(): Promise<ICountry[]> {
    const res = await fetch(`${url}/all`);
    return res.json();
}