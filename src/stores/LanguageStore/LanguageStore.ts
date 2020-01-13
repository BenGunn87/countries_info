import {action, computed, observable} from 'mobx';
import {IDictionary, ILangLabels} from '../../type/common.type';
import {langLabel} from '../../dictionary/dictionary';

// Ключ для хранения выбранного языка в localStorage
export const KEY_TO_LANG = 'lang';
// Язык по умолчанию
export const DEFAULT_LANG = 'en';

/**
 * Store для хранения информации о языке интерфейса
 */
export class LanguageStore  {
	@observable
	public currentLanguage: keyof IDictionary;

	public defaultLangLabels: ILangLabels;
	public dictionary: IDictionary;

	public constructor() {
		let saveLang = window.localStorage.getItem(KEY_TO_LANG) as keyof IDictionary | null;
		if (!saveLang) {
			saveLang = DEFAULT_LANG;
			window.localStorage.setItem(KEY_TO_LANG, saveLang);
		}
		this.currentLanguage = saveLang;
		this.defaultLangLabels = langLabel[DEFAULT_LANG];
		this.dictionary = langLabel;
	}

	@computed
	get currentLangLabels(): ILangLabels {
		const tmpLang = langLabel[this.currentLanguage];
		return tmpLang ? tmpLang : {translation: {}, name: ''};
	}

	/**
	 * Метод для задания языка интерфейса
	 *
	 * @param {keyof IDictionary} lang - язык
	 */
	@action
	public setCurrentLanguage = (lang: keyof IDictionary) => {
		this.currentLanguage = lang;
		window.localStorage.setItem(KEY_TO_LANG, this.currentLanguage);
	};
}
