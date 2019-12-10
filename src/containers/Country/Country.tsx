import React, {ChangeEvent} from 'react';
import {inject, observer} from "mobx-react";
import {CountryView} from "../../components";
import {ICountry} from "../../type/common.type";
import {ICountryProps} from "./Country.type";
import {ICountryViewProps} from "../../components/CountryView/CountryView.type";
import {SearchView} from "../../components/SearchView/SearchView";

@inject('countries')
@observer
export class Country extends React.Component<ICountryProps> {
    public constructor(props: ICountryProps) {
        super(props);
    }

    public componentDidMount(): void {
        const {getCountryList} = this.props.countries!;
        getCountryList();
    }

    public render() {
        const {countryList, selectedCountry, setSelectedCountry} = this.props.countries!;

        return (<>

            <SearchView
                list={countryList.map(({name}) => name)}
                onChange={this.onSearchViewChange}
                ref={(el) => el}
                onListElementClick={setSelectedCountry}
            />
                <div>
                    {selectedCountry &&
                    <CountryView {...selectedCountry}/>}
                </div>
            </>
        );
    }

    private getCountryProp = (country: ICountry): ICountryViewProps | undefined => {
        if (country) {
            return {
                name: country.name,
                capital: country.capital,
                flag: country.flag,
                population: country.population,
            };
        }
        return undefined;
    };

    private onSearchViewChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {setSearchCountryValue} = this.props.countries!;
        const value = e.target.value ? e.target.value : '';
        setSearchCountryValue(value);
    };
}
