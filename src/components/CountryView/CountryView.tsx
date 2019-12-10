import React from "react";
import {ICountryViewProps} from "./CountryView.type";
import {observer} from "mobx-react";

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
            <>
                {name && <div>
                    {name}
                </div>}
                {flag &&
                <div>
                    {flag}
                </div>
                }
                {population &&
                    <div>
                        {population}
                    </div>
                }
                {capital &&
                <div>
                    {capital}
                </div>}
            </>
        );
    }
}