import {action, computed, observable} from 'mobx';
import {ILangLabels, Language} from '../type/common.type';
import ruLabel from '../JSON/ru.json';
import enLabel from '../JSON/en.json';

export class CommonStore {
	@observable
	public currentLanguage: Language;

	public constructor(defaultLang : Language = Language.ru) {
		this.currentLanguage = defaultLang;
	}

	@computed
	get currentLangLabels(): ILangLabels {

		switch (this.currentLanguage) {
			case Language.ru:
				return ruLabel as ILangLabels;
			case Language.en:
				return enLabel as ILangLabels;
		}
		return {translation: {}}
	}

	public defaultLangLabels: ILangLabels = enLabel as ILangLabels;

	@action
	public setCurrentLanguage = (lang: Language) => {
		this.currentLanguage = lang;
	}
}