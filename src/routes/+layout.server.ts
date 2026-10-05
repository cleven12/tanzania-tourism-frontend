import { getSiteSettings, apiBase } from '$lib/server/api';
import type { SiteSetting } from '$lib/types';
import type { LayoutServerLoad } from './$types';

const fallback: SiteSetting = {
	siteName: 'Tanzania Safari Co.',
	tagline: 'Handcrafted safaris and tours across Tanzania',
	contactEmail: 'clevengodsontech@gmail.com'
} as SiteSetting;

export const load: LayoutServerLoad = async () => {
	let site: SiteSetting = fallback;
	try {
		const s = await getSiteSettings();
		if (s) site = { ...fallback, ...s };
	} catch (e) {
		console.error('getSiteSettings failed, using fallback', e);
	}
	return { site, apiBase: apiBase() };
};
