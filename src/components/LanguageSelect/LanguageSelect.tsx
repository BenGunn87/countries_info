import React from "react";
import {IDictionary} from "../../type/common.type";
import {inject, observer} from "mobx-react";
import {LanguageStore} from "../../stores/LanguageStore";

export const LanguageSelect = inject('languageStore') (observer((props: {languageStore?: LanguageStore}) => {
    const {setCurrentLanguage, currentLanguage, dictionary} = props.languageStore!;
    const optionList = Object.entries(dictionary).map(([key, value]) => {
        return <option
            value={key}
            key={key}
        >
            {value.name}
        </option>
    });

    return <select
        value={currentLanguage}
        onChange={(event) => {setCurrentLanguage(event.target.value as keyof IDictionary);}}
    >
        {optionList}
    </select>
}));