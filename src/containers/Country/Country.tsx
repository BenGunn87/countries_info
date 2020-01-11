import React from 'react';
import {inject, observer} from "mobx-react";
import {CountryView} from "../../components";
import {langLabel} from '../../utils/langLabel';
import {ICountryProps} from "./Country.type";
import {SearchView} from "../../components/SearchView/SearchView";
import {LanguageSelect} from '../../components/LanguageSelect/LanguageSelect';
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
        const {countryList, selectedCountry, setSelectedCountry, isLoad} = this.props.countriesStore!;
        if (!isLoad) {
            return <div style={{paddingTop: '20px'}}>Загрузка</div>;
        }
        return <div className="country">
            <div className="country__bar">
                <div className="country__search">
                    <SearchView
                        list={countryList.map(({name, alpha3Code}) => {return {key: alpha3Code, value: name}})}
                        onListElementSelect={setSelectedCountry}
                        label={langLabel('Search')}
                    />
                </div>
                <div className="country__lang">
                    <LanguageSelect/>
                </div>
            </div>
            <div className="country__info">
                {selectedCountry &&
                <CountryView {...selectedCountry}
                             setSelectedCountry={setSelectedCountry}
                             countryList={countryList}
                />}
            </div>
        </div>;
    }
}
