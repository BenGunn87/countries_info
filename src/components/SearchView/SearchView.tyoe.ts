import {ChangeEventHandler} from "react";

export interface ISearchViewProps {
    searchValue?: string;
    list: string[];
    onChange: ChangeEventHandler<HTMLInputElement>;
    maxCount?: number;
    onListElementClick?: (value: string) => void;
}