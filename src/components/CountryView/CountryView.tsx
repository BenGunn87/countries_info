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
            capital
        } = this.props;
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
                </div>
            </section>
        );
    }
}