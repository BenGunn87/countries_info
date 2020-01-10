import {ICountry} from "../type/common.type";
import {getAllCountries} from "../api/restcountries";
import {action, observable} from "mobx";

export class CountriesStore {
    @observable
    public countryList: ICountry[];
    @observable
    public selectedCountry?: ICountry;

    public constructor() {
        this.countryList = [];
    }

    public getCountryList = async () => {
        const CountryList = await getAllCountries();
        this.setCountryList(CountryList);
    };

    @action
    public setCountryList = (arr: ICountry[]) => {
        this.countryList = arr;
    };

    @action
    public setSelectedCountry = (value: string) => {
        this.selectedCountry = this.countryList.find(country => country.name === value);
    };
}