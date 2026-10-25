import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDestination } from '$lib/server/api';
import { renderRichtext } from '$lib/richtext';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const destination = await getDestination(params.slug);
	if (!destination) error(404, 'Destination not found');
	setHeaders({ 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' });
	return { destination, descriptionHtml: renderRichtext(destination.description) };
};
