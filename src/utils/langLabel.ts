import {commonStore} from '../stores/index';

export function langLabel(id: string) {
	const currentLangLabels = commonStore.currentLangLabels;
	let label = currentLangLabels.translation[id];
	label = label ? label : commonStore.defaultLangLabels.translation[id];
	return label ? label : '';
}


