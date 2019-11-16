import {ICountry} from "../type/common";

const url = 'https://restcountries.eu/rest/v2';

export async function getAllCountries(): Promise<ICountry[]> {
    const res = await fetch(`${url}/all`);
    return res.json();
}