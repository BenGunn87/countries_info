import {action, autorun, computed, observable} from 'mobx';
import {IDictionary, ILangLabels} from '../type/common.type';
import {langLabel} from '../dictionary/dictionary';

const KEY_TO_LANG = 'lang';
const DEFAULT_LANG = 'en';


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

	@action
	public setCurrentLanguage = (lang: keyof IDictionary) => {
		this.currentLanguage = lang;
	};

	private setLangToLocalStorage = autorun(() => {
		if (this.currentLanguage) {
			window.localStorage.setItem(KEY_TO_LANG, this.currentLanguage);
		}
	})
}
