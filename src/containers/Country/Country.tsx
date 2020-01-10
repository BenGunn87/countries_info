import React from 'react';
import {inject, observer} from "mobx-react";
import {CountryView} from "../../components";
import {langLabel} from '../../utils/langLabel';
import {ICountryProps} from "./Country.type";
import {SearchView} from "../../components/SearchView/SearchView";
import './Country.css';

@inject('countriesStore')
@observer
export class Country extends React.Component<ICountryProps> {
    public constructor(props: ICountryProps) {
        super(props);
    }

    public componentDidMount(): void {
        const {getCountryList} = this.props.countriesStore!;
        getCountryList();
    }

    public render() {
        const {countryList, selectedCountry, setSelectedCountry} = this.props.countriesStore!;
        return <div className="country">
            <div className="country__search">
                <SearchView
                    list={countryList.map(({name}) => name)}
                    onListElementSelect={setSelectedCountry}
                    label={langLabel('Search')}
                />
            </div>
            <div className="country__info">
                {selectedCountry &&
                <CountryView {...selectedCountry}/>}
            </div>
        </div>;
    }
}
