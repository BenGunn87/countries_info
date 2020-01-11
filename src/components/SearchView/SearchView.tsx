import React, {ChangeEvent, KeyboardEvent} from "react";
import {ISearchViewProps} from "./SearchView.type";
import {observer} from "mobx-react";
import {action, computed, IReactionDisposer, observable, reaction, transaction} from 'mobx';
import {IKeyValue} from "../../type/common.type";
import './SearchView.css';

class SearchViewStore {
    private readonly maxCount: number = 10;

    @observable
    public showList: boolean = false;
    @observable
    public value: string = '';
    @observable
    public list: IKeyValue[] = [];
    @observable
    public activeItemKey: string = '';

    @computed get displayList(): IKeyValue[] {
        if (this.value === '') {
            return [];
        }
        const searchValue = this.value.toUpperCase();
        const resultList = this.list.filter(({value}) => value.toUpperCase().includes(searchValue));
        if (resultList.length > this.maxCount) {
            resultList.length = this.maxCount;
        }
        return resultList;
    }

    @computed get activeItemIndex(): number {
        return this.displayList.findIndex(({key}) => key === this.activeItemKey);
    }

    public constructor(props: ISearchViewProps) {
        if (props.maxCount) {
            this.maxCount = props.maxCount;
        }
        this.list = props.list;
    }

    @action
    public setShowList = (flag: boolean) => {
        this.showList = flag;
        this.activeItemKey = '';
    };

    @action
    public setValue = (value: string) => {
        this.value = value;
        this.activeItemKey = '';
    };

    @action
    public setList = (list: IKeyValue[]) => {
        this.list = list;
        this.activeItemKey = '';
    };

    @action
    public setActiveItemKey = (key: string) => {
        this.activeItemKey = key;
    };

    @action
    public moveActiveItem = (directions: number) => {
        if (this.displayList.length > 0) {
            const newIndex = this.activeItemIndex !== -1
                ? (this.activeItemIndex + directions + this.displayList.length) % this.displayList.length
                : directions === 1 ? 0 : this.displayList.length -1 ;
            this.activeItemKey = this.displayList[newIndex].key;
        }
    }
}

@observer
export class SearchView extends React.Component<ISearchViewProps> {
    public static defaultProps = {
        displayList: [],
    };

    private readonly store: SearchViewStore;
    private handlerReaction?: IReactionDisposer = undefined;
    private toggleContainer = React.createRef<HTMLDivElement>();
    private inputRef = React.createRef<HTMLInputElement>();
    private timeOutId?: number;

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

    public render () {
        const {showList, value, displayList} = this.store;
        const {label} = this.props;

        const list = this.renderDisplayList(displayList);
        return (
            <div className="search-view"
                 ref={this.toggleContainer}
                 onFocus={this.onFocusHandler}
                 onKeyUp={this.onKeyAction}
            >
                <div className="search-view__input-container">
                    <input
                        className="search-view__input"
                        ref={this.inputRef}
                        value={value}
                        onChange={this.onChange}
                        onFocus={this.onInputFocusHandler}
                        onBlur={this.onBlurHandler}
                        placeholder={label}
                    />
                    {showList && list}
                </div>
            </div>)
    }

    private onKeyAction = (event: KeyboardEvent<HTMLInputElement>) => {
        const {moveActiveItem} = this.store;
        switch (event.key) {
            case 'ArrowDown':
                moveActiveItem(1);
                break;
            case 'ArrowUp':
                moveActiveItem(-1);
                break;
            case 'Enter':
                if (this.store.activeItemKey !== '') {
                    this.selectElement(this.store.activeItemKey);
                    if (this.inputRef.current) {
                        this.inputRef.current.blur();
                    }
                }
                break;
            case 'Escape':
                if (this.inputRef.current) {
                    this.inputRef.current.blur();
                }
                break;
        }
    };

    private onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value ? event.target.value : '';
        const {onChange} = this.props;
        this.store.setValue(value);
        if (onChange) {
            onChange(value);
        }
    };

    private renderDisplayList = (displayList: IKeyValue[]) => {
        if (displayList.length > 0) {
            return (<ul className="search-view__dropdown-list">
                {
                displayList.map(({key, value}) => {
                    let liClassNames = 'search-view__li';
                    if (key === this.store.activeItemKey) {
                        liClassNames += ' search-view__li_active';
                    }
                    return <li
                        key={key}
                        onClick={this.onElementClickHandler.bind(this, key)}
                        tabIndex={-1}
                        className={liClassNames}
                        onMouseOver={this.onElementMouseOverHandler.bind(this, key)}
                    >
                        {value}
                    </li>
                })}
            </ul>);
        }
        return null;
    };

    private onElementMouseOverHandler = (key: string) => {
        this.store.setActiveItemKey(key);
    };

    private onInputFocusHandler = () => {
        this.store.setShowList(true);
    };

    private onFocusHandler = () => {
        clearTimeout(this.timeOutId);
    };

    private onElementClickHandler = (key: string) => {
        this.selectElement(key);
    };

    private selectElement = (key : string) => {
        transaction(() => {
            this.store.setShowList(false);
            this.store.setValue('');
        });
        const {onListElementSelect} = this.props;
        if (onListElementSelect) {
            onListElementSelect(key);
        }
    };

    private onBlurHandler = () => {
        this.timeOutId = setTimeout(() => {
            if (this.store.showList) {
                this.store.setShowList(false);
            }
        });
    }
}