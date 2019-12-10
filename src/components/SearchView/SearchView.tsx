import React, {ChangeEvent, FocusEvent, MouseEvent} from "react";
import {ISearchViewProps} from "./SearchView.tyoe";
import {observer} from "mobx-react";
import {action, computed, IReactionDisposer, observable, reaction} from "mobx";
import './SearchView.css';

class SearchViewStore {
    @observable
    public showList: boolean = false;
    @observable
    public value: string = '';
    @observable
    public list: string[] = [];

    @computed get displayList(): string[] {
        const searchValue = this.value.toUpperCase();
        const resultList = this.list.reduce((res, item) => {
            if (item.toUpperCase().includes(searchValue)) {
                res.push(item);
            }
            return res;
        }, [] as string[]);
        if (resultList.length > this.maxCount) {
            resultList.length = this.maxCount;
        }
        return resultList;
    }

    private readonly maxCount: number = 10;

    public constructor(props: ISearchViewProps) {
        if (props.maxCount) {
            this.maxCount = props.maxCount;
        }
        this.list = props.list;
    }

    @action
    public setShowList = (flag: boolean) => {
        this.showList = flag;
    };

    @action
    public setValue = (value: string) => {
        this.value = value;
    };

    @action
    public setList = (list: string[]) => {
        this.list = list;
    }
}

@observer
export class SearchView extends React.Component<ISearchViewProps> {
    public static defaultProps = {
        displayList: [],
    };

    private readonly store: SearchViewStore;
    private handlerReaction?: IReactionDisposer = undefined;

    public constructor(props: ISearchViewProps) {
        super(props);
        this.store = new SearchViewStore(props);
    }

    public componentDidMount() {
        this.handlerReaction = reaction(() => this.props.list,
            list => {
                this.store.setList(list);
            });
    }

    public componentWillUnmount() {
        if (this.handlerReaction) {
            this.handlerReaction();
        }
    }

    public render () {
        const {showList, value, displayList} = this.store;
        const list = this.renderDisplayList(displayList);
        return <>
            <div className="search-view">
                <input
                    className="search-view__input"
                    value={value}
                    onChange={this.onChange}
                    onFocus={this.onInputFocus}
                    onBlur={this.onInputBlur}
                />
                {showList && list}
            </div>
            </>
    }

    private onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value ? event.target.value : '';
        const {onChange} = this.props;
        this.store.setValue(value);
        onChange(event);
    };

    private renderDisplayList = (displayList: string[]) => {
        if (displayList) {
            return (<ul className="search-view__dropdown-list">
                {
                displayList.map(item => {
                    return <li key={item} onClick={this.onElementClick.bind(this, item)}>
                        {item}
                    </li>
                })}
            </ul>);
        }
        return null;
    };

    private onInputFocus = (event: FocusEvent<HTMLInputElement>) => {
        this.store.setShowList(true);
    };

    private onInputBlur = (event: FocusEvent<HTMLInputElement>) => {
        setTimeout(() => {this.store.setShowList(false)}, 100);
    };

    private onElementClick = (value: string, event: MouseEvent<HTMLLIElement>) => {
        this.store.setShowList(false);
        this.store.setValue('');
        const {onListElementClick} = this.props;
        if (onListElementClick) {
            onListElementClick(value);
        }
    }
}