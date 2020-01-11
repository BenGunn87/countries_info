import {action, computed, observable} from 'mobx';
import {ILangLabels, Language} from '../type/common.type';
import {ruLabel} from '../dictionary/ruDictionary';
import {enLabel} from '../dictionary/enDictionary';

export class LanguageStore  {
	@observable
	public currentLanguage: Language;
	public defaultLangLabels: ILangLabels;

	public constructor(defaultLang : Language = Language.ru) {
		this.currentLanguage = defaultLang;
		this.defaultLangLabels = enLabel;
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

	@action
	public setCurrentLanguage = (lang: Language) => {
		this.currentLanguage = lang;
	}
}