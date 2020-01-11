import {ICountry} from "../type/common.type";
import {getAllCountries} from "../api/restcountries";
import {action, observable} from "mobx";

export class CountriesStore {
    @observable
    public countryList: ICountry[];
    @observable
    public selectedCountry?: ICountry;
    @observable
    public isLoad: boolean = true;

    public constructor() {
        this.countryList = [];
    }

    public getCountryList = async () => {
        try {
            this.isLoad = false;
            const CountryList = await getAllCountries();
            this.setCountryList(CountryList);
        } finally {
            this.isLoad = true;
        }
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