export interface ISearchViewProps {
    searchValue?: string;
    list: string[];
    onChange?: (value: string) => void;
    maxCount?: number;
    onListElementSelect?: (value: string) => void;
    label?: string;
}