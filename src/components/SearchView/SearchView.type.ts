import {IKeyValue} from "../../type/common.type";

export interface ISearchViewProps {
    list: IKeyValue[];
    label?: string;
    maxCount?: number;
    onChange?: (value: string) => void;
    onListElementSelect?: (value: string) => void;
}

export enum Direction {
    up,
    down
}