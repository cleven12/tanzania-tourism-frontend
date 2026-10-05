import type { PageServerLoad } from './$types';
import { getDestinations } from '$lib/server/api';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' });
	return { destinations: await getDestinations() };
};
