import type { PageServerLoad } from './$types';
import { getFeaturedTours, getDestinations, getTestimonials } from '$lib/server/api';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' });
	const [tours, destinations, testimonials] = await Promise.all([
		getFeaturedTours(6),
		getDestinations(),
		getTestimonials()
	]);
	return { tours, destinations, testimonials };
};
