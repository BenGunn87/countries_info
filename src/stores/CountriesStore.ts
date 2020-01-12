import {ICountry} from "../type/common.type";
import {getAllCountries} from "../api/restcountries";
import {action, observable} from "mobx";

/**
 * Store для хранения информации о странах
 */
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

    /**
     * Метод для получения списка стран
     */
    public getCountryList = async () => {
        try {
            this.isLoad = false;
            const CountryList = await getAllCountries();
            this.setCountryList(CountryList);
        } finally {
            this.isLoad = true;
        }
    };

    /**
     * Метод для задания списка стран
     *
     * @param {ICountry[]} arr - список стран
     */
    @action
    public setCountryList = (arr: ICountry[]) => {
        this.countryList = arr;
    };

    /**
     * Метод для задания ключа выбранной страны
     *
     * @param {string} key - ключ выбранной страны
     */
    @action
    public setSelectedCountry = (key: string) => {
        this.selectedCountry = this.countryList.find(country => country.alpha3Code === key);
    };
}