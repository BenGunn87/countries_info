import {ICountry} from "../../type/common.type";

export interface ICountryViewProps {
    name?: string;
    flag?: string;
    population?: number;
    capital?: string;
    borders?: string[];
    countryList: ICountry[];
    setSelectedCountry: (value: string) => void;
}