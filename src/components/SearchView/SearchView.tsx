import React, {ChangeEvent, KeyboardEvent} from "react";
import {Direction, ISearchViewProps} from "./SearchView.type";
import {observer} from "mobx-react";
import {action, computed, IReactionDisposer, observable, reaction, transaction} from 'mobx';
import {IKeyValue} from "../../type/common.type";
import './SearchView.css';

/**
 * Store для компонента поиска
 */
class SearchViewStore {
    // максимальное количество значений в выпадающем списке
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

        const resultList = this.list.filter(({value}) => value.toUpperCase().includes(this.value.toUpperCase()));
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

    /**
     * Метод для задания видимости выпадающего списка
     *
     * @param {boolean} flag - флаг
     */
    @action
    public setShowList = (flag: boolean) => {
        this.showList = flag;
        this.activeItemKey = '';
    };

    /**
     * Метод для задания введенного значения
     *
     * @param {string} value - значение
     */
    @action
    public setValue = (value: string) => {
        this.value = value;
        this.activeItemKey = '';
    };

    /**
     * Метод для задания списка значений для выбора
     *
     * @param {IKeyValue[]} list - список значений для выбора
     */
    @action
    public setList = (list: IKeyValue[]) => {
        this.list = list;
        this.activeItemKey = '';
    };

    /**
     * Метод для задания выделенного значения из списка
     *
     * @param {string} key - ключ
     */
    @action
    public setActiveItemKey = (key: string) => {
        this.activeItemKey = key;
    };

    /**
     * Метод для смещения указателя на выделенное значения
     *
     * @param {Direction} direction - направление смещения
     */
    @action
    public moveActiveItem = (direction: Direction) => {
        if (this.displayList.length > 0) {
            const step = direction === Direction.up ? -1 : 1;
            const newIndex = this.activeItemIndex !== -1
                ? (this.activeItemIndex + step + this.displayList.length) % this.displayList.length
                : direction === Direction.down ? 0 : this.displayList.length - 1 ;
            this.activeItemKey = this.displayList[newIndex].key;
        }
    }
}

/**
 * Компонент для поиска в списке значений
 */
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

        const list = showList ? this.renderDisplayList(displayList) : null;
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
                        onChange={this.onChangeHandler}
                        onFocus={this.onInputFocusHandler}
                        onBlur={this.onInputBlurHandler}
                        placeholder={label}
                    />
                    {showList && list}
                </div>
            </div>)
    }

    /**
     * Метод для обработки нажатия клавиш
     *
     * @param {KeyboardEvent<HTMLInputElement>} event - событие
     */
    private onKeyAction = (event: KeyboardEvent<HTMLInputElement>) => {
        const {moveActiveItem} = this.store;
        switch (event.key) {
            case 'ArrowDown':
                moveActiveItem(Direction.down);
                break;
            case 'ArrowUp':
                moveActiveItem(Direction.up);
                break;
            case 'Enter':
                if (this.store.activeItemKey !== '') {
                    this.selectItem(this.store.activeItemKey);
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

    /**
     * Метод для обработки вводы значения в input
     *
     * @param {ChangeEvent<HTMLInputElement>} event - событие
     */
    private onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {onChange} = this.props;
        const value = event.target.value ? event.target.value : '';
        this.store.setValue(value);
        if (onChange) {
            onChange(value);
        }
    };

    /**
     * Метод для обработки установки фокуса на компоненте SearchView
     */
    private onFocusHandler = () => {
        clearTimeout(this.timeOutId);
    };

    /**
     * Метод для обработки потери фокуса input-ом
     */
    private onInputBlurHandler = () => {
        this.timeOutId = setTimeout(() => {
            if (this.store.showList) {
                this.store.setShowList(false);
            }
        });
    };

    /**
     * Метод для обработки установки фокуса на input
     */
    private onInputFocusHandler = () => {
        this.store.setShowList(true);
    };

    /**
     * Метод для рендера выпадающего списка
     *
     * @param {IKeyValue[]} displayList - значения для выпадающего списка
     */
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

    /**
     * Метод для обработки наведения курсора на элемент списка
     *
     * @param {string} key - ключ элемента
     */
    private onElementMouseOverHandler = (key: string) => {
        this.store.setActiveItemKey(key);
    };

    /**
     * Метод для обработки нажатия на элимент списка
     *
     * @param {string} key - ключ элимента
     */
    private onElementClickHandler = (key: string) => {
        this.selectItem(key);
    };

    /**
     * Методя для обработки выбора элемента
     *
     * @param {string} key - ключ элемента
     */
    private selectItem = (key : string) => {
        const {onListElementSelect} = this.props;

        transaction(() => {
            this.store.setShowList(false);
            this.store.setValue('');
        });
        if (onListElementSelect) {
            onListElementSelect(key);
        }
    };
}