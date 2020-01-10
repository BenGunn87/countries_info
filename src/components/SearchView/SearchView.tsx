import React, {ChangeEvent, FocusEvent, MouseEvent, KeyboardEvent} from "react";
import {ISearchViewProps} from "./SearchView.tyoe";
import {observer} from "mobx-react";
import {action, computed, IReactionDisposer, observable, reaction, transaction} from 'mobx';
import './SearchView.css';

class SearchViewStore {
    @observable
    public showList: boolean = false;
    @observable
    public value: string = '';
    @observable
    public list: string[] = [];
    @observable
    public activeItem: string = '';

    @computed get displayList(): string[] {
        if (this.value === '') {
            return [];
        }

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

    @computed get activeItemIndex(): number {
        return this.displayList.indexOf(this.activeItem);
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
        this.activeItem = '';
    };

    @action
    public setValue = (value: string) => {
        this.value = value;
        this.activeItem = '';
    };

    @action
    public setList = (list: string[]) => {
        this.list = list;
        this.activeItem = '';
    };

    @action
    public setActiveItem = (value: string) => {
        this.activeItem = value;
    };

    @action
    public moveActiveItem = (directions: number) => {
        if (this.displayList.length > 0) {
            const newIndex = this.activeItemIndex !== -1
                ? (this.activeItemIndex + directions + this.displayList.length) % this.displayList.length
                : directions === 1 ? 0 : this.displayList.length -1 ;
            this.activeItem = this.displayList[newIndex];
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
        return <>
            <div className="search-view"
                 ref={this.toggleContainer}
                 onFocus={this.onFocusHandler}
                 onKeyUp={this.onKeyAction}
            >
                {
                    label && <label className="search-view__label">
                        {label}
                    </label>
                }
                <div className="search-view__input-container">
                    <input
                        className="search-view__input"
                        ref={this.inputRef}
                        value={value}
                        onChange={this.onChange}
                        onFocus={this.onInputFocusHandler}
                        onBlur={this.onBlurHandler}
                    />
                    {showList && list}
                </div>
            </div>
            </>
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
                if (this.store.activeItem !== '') {
                    this.selectElement(this.store.activeItem);
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

    private renderDisplayList = (displayList: string[]) => {
        if (displayList.length > 0) {
            return (<ul className="search-view__dropdown-list">
                {
                displayList.map(item => {
                    let liClassNames = 'search-view__li';
                    if (item === this.store.activeItem) {
                        liClassNames += ' search-view__li_active';
                    }
                    return <li
                        key={item}
                        onClick={this.onElementClickHandler.bind(this, item)}
                        tabIndex={-1}
                        className={liClassNames}
                        onMouseOver={this.onElementMouseOverHandler.bind(this, item)}
                    >
                        {item}
                    </li>
                })}
            </ul>);
        }
        return null;
    };

    private onElementMouseOverHandler = (value: string, event: MouseEvent<HTMLLIElement>) => {
        this.store.setActiveItem(value);
    };

    private onInputFocusHandler = (event: FocusEvent<HTMLInputElement>) => {
        this.store.setShowList(true);
    };

    private onFocusHandler = () => {
        clearTimeout(this.timeOutId);
    };

    private onElementClickHandler = (value: string, event: MouseEvent<HTMLLIElement>) => {
        this.selectElement(value);
    };

    private selectElement = (value : string) => {
        transaction(() => {
            this.store.setShowList(false);
            this.store.setValue('');
        });
        const {onListElementSelect} = this.props;
        if (onListElementSelect) {
            onListElementSelect(value);
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