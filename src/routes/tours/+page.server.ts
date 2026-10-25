import type { PageServerLoad } from './$types';
import { getTours, getCategories, getDestinations } from '$lib/server/api';

export const load: PageServerLoad = async ({ url, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' });
	const category = url.searchParams.get('category') || undefined;
	const destination = url.searchParams.get('destination') || undefined;
	const q = url.searchParams.get('q')?.trim().slice(0, 100) || undefined;
	const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
	const [result, categories, destinations] = await Promise.all([
		getTours({ category, destination, q, page, pageSize: 9 }),
		getCategories(),
		getDestinations()
	]);
	return { result, categories, destinations, filters: { category, destination, q, page } };
};
