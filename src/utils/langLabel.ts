import {languageStore} from '../stores';

/**
 * Функция для получения подписи на текущем языке
 *
 * @param {string} id - id подписи
 */
export function langLabel(id: string) {
	const currentLangLabels = languageStore.currentLangLabels;
	let label = currentLangLabels.translation[id];
	label = label ? label : languageStore.defaultLangLabels.translation[id];
	return label ? label : '';
}


