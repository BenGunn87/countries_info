import {langLabel} from '../../dictionary/dictionary';
import {DEFAULT_LANG, KEY_TO_LANG, LanguageStore} from './LanguageStore';

jest.mock('../../dictionary/dictionary', () => {
		return {
			langLabel: {
				en: {
					name: 'English',
					translation: {
						test: 'test',
						test2: 'test2'
					}
				},
			}
		};
	}
);

const lang = window.localStorage.getItem(KEY_TO_LANG);

beforeEach(() => {
	window.localStorage.removeItem(KEY_TO_LANG);
});

afterEach(() => {
	window.localStorage.removeItem(KEY_TO_LANG);
	if (lang) {
		window.localStorage.setItem(KEY_TO_LANG, lang);
	}
});

describe('Проверка работы конструктора LanguageStore', () => {
	it('Проверяем, что в текущий язык подставляется DEFAULT_LANG, есди нет значения в localStorage', () => {
		const languageStore = new LanguageStore();
		expect(languageStore.currentLanguage)
			.toBe(DEFAULT_LANG);
	});
	it('Проверяем, что в текущий язык подставляется значение из localStorage', () => {
		window.localStorage.setItem(KEY_TO_LANG, 'test');
		const languageStore = new LanguageStore();
		expect(languageStore.currentLanguage)
			.toBe('test');
	});
	it('Проверяем, что в язык по умолчанию подставляется значение соответствующее DEFAULT_LANG', () => {
		const languageStore = new LanguageStore();
		expect(languageStore.defaultLangLabels)
			.toBe(langLabel[DEFAULT_LANG]);
	});
});

describe('Проверка работы методя setCurrentLanguage', () => {
	it ('Передаем "ru", ожидается, что текущий язык изменится на "ru"', () => {
		window.localStorage.setItem(KEY_TO_LANG, 'en');
		const languageStore = new LanguageStore();
		languageStore.setCurrentLanguage('ru');
		expect(languageStore.currentLanguage)
			.toBe('ru');
	});
	it ('Передаем "ru", ожидается, что язык сохраненный в localStorage изменится на "ru"', () => {
		window.localStorage.setItem(KEY_TO_LANG, 'en');
		const languageStore = new LanguageStore();
		languageStore.setCurrentLanguage('ru');
		expect(window.localStorage.getItem(KEY_TO_LANG))
			.toBe('ru');
	});
});