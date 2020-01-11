import {languageStore} from '../../stores';
import React from "react";
import {IDictionary} from "../../type/common.type";

export const LanguageSelect: React.FunctionComponent = () => {
    const {setCurrentLanguage, currentLanguage, dictionary} = languageStore;
    const optionList = Object.entries(dictionary).map(([key, value]) => {
        return <option value={key} key={key}>{value.name}</option>
    });

    return <select
        value={currentLanguage}
        onChange={
            (event) => {
                setCurrentLanguage(event.target.value as keyof IDictionary);
            }
        }
    >
        {optionList}
    </select>
};