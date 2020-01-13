import {langLabel} from './langLabel';

jest.mock('../../stores/index', () => {
		return {
			languageStore: {
				defaultLangLabels: {
					name: 'English',
					translation: {
						test: 'test',
						test2: 'test2'
					}
				},
				currentLangLabels: {
					name: 'Русский',
					translation: {
						test: 'Тест'
					}
				}
			}
		};
	}
);

describe('Проверка функции langLabel', () => {
	it('Передаем id="test", который есть для текущего языка, ожидается "Тест"', () => {
		expect(langLabel('test'))
			.toBe('Тест');
	});
	it('Передаем id="test2", которого нет для текущего языка, но есть для языка по умолчанию, ожидается "test2"', () => {
		expect(langLabel('test2'))
			.toBe('test2');
	});
	it('Передаем id="test3", которого нет для текущего языка и языка по умолчанию, ожидается ""', () => {
		expect(langLabel('test3'))
			.toBe('');
	});
});
