import {action, observable} from "mobx";
import {ICountry} from "../type/common";
import {getAllCountries} from "../api/restcountries";

export class Countries {
    @observable
    public countryList: ICountry[] = [];

    public getCountryList = async () => {
        const CountryListawait = await getAllCountries();
        this.setCountryList(CountryListawait);
    };

    @action
    private setCountryList = (arr: ICountry[]) => {
        this.countryList = arr;
    }
}