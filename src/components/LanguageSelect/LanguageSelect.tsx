import {languageStore} from '../../stores';
import React from "react";
import {Language} from "../../type/common.type";

export const LanguageSelect: React.FunctionComponent = () => {
    const {setCurrentLanguage, currentLanguage} = languageStore;

    return <select
        value={currentLanguage}
        onChange={
            (event) => {
                setCurrentLanguage(event.target.value as Language);
            }
        }
    >
        <option value={Language.ru}>ru</option>
        <option value={Language.en}>en</option>
    </select>
};