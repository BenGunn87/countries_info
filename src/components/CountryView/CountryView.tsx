import React from "react";
import {langLabel} from '../../utils/langLabel';
import {ICountryViewProps} from "./CountryView.type";
import {observer} from "mobx-react";
import './CountryView.css';

@observer
export class CountryView extends React.Component<ICountryViewProps> {
    public constructor(props: ICountryViewProps) {
        super(props);
    }

    public render() {
        const {
            name,
            flag,
            population,
            capital,
            borders,
        } = this.props;

        const bordersList = this.renderBordersList(borders);
        return (
            <section className="country-info">
                {flag &&
                <img src={flag} alt={langLabel('Flag')} className="country-info__flag"/>
                }
                <div className="country-info__description-container">
                    {name && <div>
                        {langLabel('Country')}: {name}
                    </div>}
                    {capital &&
                    <div>
                        {langLabel('Capital')}: {capital}
                    </div>}
                    {population &&
                    <div>
                        {langLabel('Population')}: {population}
                    </div>}
                    {bordersList}
                </div>
            </section>
        );
    }

    private renderBordersList = (borders?: string[]) => {
        if (borders && borders.length > 0) {
            const {countryList, setSelectedCountry} = this.props;
            const borderCountryList = borders.map(key => {
                const country = countryList.find(({alpha3Code}) => alpha3Code === key);
                return <li
                    key={key}
                    onClick={() => setSelectedCountry(key)}
                    className="country-info__borders-item"
                >
                    {country ? country.name : key}
                </li>
            });
            return <div>
                {langLabel('Borders')}:
                <ul className="country-info__borders-list">
                    {borderCountryList}
                </ul>
            </div>
        }
        return null;
    };
}