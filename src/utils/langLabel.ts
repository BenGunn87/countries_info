import {languageStore} from '../stores';

export function langLabel(id: string) {
	const currentLangLabels = languageStore.currentLangLabels;
	let label = currentLangLabels.translation[id];
	label = label ? label : languageStore.defaultLangLabels.translation[id];
	return label ? label : '';
}


