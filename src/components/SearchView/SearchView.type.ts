import {IKeyValue} from "../../type/common.type";

export interface ISearchViewProps {
    searchValue?: string;
    list: IKeyValue[];
    onChange?: (value: string) => void;
    maxCount?: number;
    onListElementSelect?: (value: string) => void;
    label?: string;
}