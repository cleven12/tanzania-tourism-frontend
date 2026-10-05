import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getTour } from '$lib/server/api';
import { renderRichtext } from '$lib/richtext';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const tour = await getTour(params.slug);
	if (!tour) error(404, 'Tour not found');
	setHeaders({ 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' });
	return { tour, descriptionHtml: renderRichtext(tour.description) };
};
