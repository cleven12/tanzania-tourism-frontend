import { cache } from './cache';
import type {
	Category,
	Destination,
	EnquiryPayload,
	EnquiryResult,
	Media,
	Paginated,
	SearchResult,
	SiteSetting,
	Sitemap,
	Testimonial,
	Tour
} from '$lib/types';

export const TTL_LIST = 60;
export const TTL_SETTINGS = 300;

type Fetch = typeof fetch;
type Query = Record<string, string | number | boolean | undefined>;

export function apiBase(): string {
	return (process.env.PUBLIC_API_URL || 'http://localhost:1337').replace(/\/+$/, '');
}

export function mediaUrl(m: Media | string | null | undefined): string {
	const u = typeof m === 'string' ? m : m?.url;
	if (!u) return '';
	if (/^(https?:)?\/\//i.test(u) || u.startsWith('data:')) return u;
	return apiBase() + (u.startsWith('/') ? u : '/' + u);
}

export function buildUrl(path: string, query: Query = {}): string {
	const parts: string[] = [];
	for (const [k, v] of Object.entries(query)) {
		if (v === undefined || v === '') continue;
		// keep Strapi bracket syntax readable: encode values and key text, not brackets
		parts.push(
			`${k
				.split(/(\[|\])/)
				.map((s) => (s === '[' || s === ']' ? s : encodeURIComponent(s)))
				.join('')}=${encodeURIComponent(String(v))}`
		);
	}
	return apiBase() + path + (parts.length ? '?' + parts.join('&') : '');
}

async function request<T>(f: Fetch, path: string, query?: Query): Promise<T> {
	const res = await f(buildUrl(path, query), { headers: { Accept: 'application/json' } });
	if (!res.ok) throw new Error(`CMS ${res.status} for ${path}`);
	return (await res.json()) as T;
}

const cached = <T>(key: string, ttl: number, load: () => Promise<T>) => cache.get(key, ttl, load);

const TOUR_CARD: Query = {
	'populate[coverImage]': 'true',
	'populate[destination][fields][0]': 'name',
	'populate[destination][fields][1]': 'slug',
	'populate[category][fields][0]': 'name',
	'populate[category][fields][1]': 'slug'
};

const TOUR_DETAIL: Query = {
	...TOUR_CARD,
	'populate[gallery]': 'true',
	'populate[destination][populate][coverImage]': 'true',
	'populate[itinerary]': 'true',
	'populate[highlights]': 'true',
	'populate[inclusions]': 'true',
	'populate[exclusions]': 'true',
	'populate[faqs]': 'true',
	'populate[seo][populate][ogImage]': 'true'
};

const emptyPage = (page: number, pageSize: number): Paginated<Tour> => ({
	data: [],
	meta: { pagination: { page, pageSize, pageCount: 0, total: 0 } }
});

export function getSiteSettings(f: Fetch = fetch): Promise<SiteSetting> {
	return cached('settings', TTL_SETTINGS, async () => {
		const r = await request<{ data: SiteSetting }>(f, '/api/site-setting', {
			'populate[logo]': 'true',
			'populate[seo][populate][ogImage]': 'true'
		});
		return r.data;
	});
}

export function getFeaturedTours(n = 6, f: Fetch = fetch): Promise<Tour[]> {
	return cached(`featured:${n}`, TTL_LIST, async () => {
		const r = await request<{ data: Tour[] }>(f, '/api/tours', {
			...TOUR_CARD,
			'filters[featured][$eq]': 'true',
			'pagination[pageSize]': n,
			sort: 'createdAt:desc'
		});
		return r.data;
	});
}

export interface TourFilters {
	category?: string;
	destination?: string;
	q?: string;
	page?: number;
	pageSize?: number;
}

export function getTours(opts: TourFilters = {}, f: Fetch = fetch): Promise<Paginated<Tour>> {
	const { category, destination, q, page = 1, pageSize = 12 } = opts;
	const term = q?.trim();
	return cached(
		`tours:${JSON.stringify([category, destination, term, page, pageSize])}`,
		TTL_LIST,
		async () => {
			const query: Query = {
				...TOUR_CARD,
				'pagination[page]': page,
				'pagination[pageSize]': pageSize,
				sort: 'createdAt:desc'
			};
			if (category) query['filters[category][slug][$eq]'] = category;
			if (destination) query['filters[destination][slug][$eq]'] = destination;
			if (term) {
				if (term.length < 2) return emptyPage(page, pageSize);
				const found = await request<{ data: SearchResult[] }>(f, '/api/search', {
					q: term,
					type: 'tour',
					limit: 20
				});
				const slugs = found.data.map((s) => s.slug);
				if (!slugs.length) return emptyPage(page, pageSize);
				slugs.forEach((s, i) => (query[`filters[slug][$in][${i}]`] = s));
				const r = await request<Paginated<Tour>>(f, '/api/tours', query);
				// preserve search ranking
				r.data.sort((a, b) => slugs.indexOf(a.slug) - slugs.indexOf(b.slug));
				return r;
			}
			return request<Paginated<Tour>>(f, '/api/tours', query);
		}
	);
}

export function getTour(slug: string, f: Fetch = fetch): Promise<Tour | null> {
	return cached(`tour:${slug}`, TTL_LIST, async () => {
		const r = await request<{ data: Tour[] }>(f, '/api/tours', {
			...TOUR_DETAIL,
			'filters[slug][$eq]': slug,
			'pagination[pageSize]': 1
		});
		return r.data[0] ?? null;
	});
}

export function getDestinations(f: Fetch = fetch): Promise<Destination[]> {
	return cached('destinations', TTL_LIST, async () => {
		const r = await request<{ data: Destination[] }>(f, '/api/destinations', {
			'populate[coverImage]': 'true',
			'pagination[pageSize]': 100,
			sort: 'name:asc'
		});
		return r.data;
	});
}

export function getDestination(slug: string, f: Fetch = fetch): Promise<Destination | null> {
	return cached(`destination:${slug}`, TTL_LIST, async () => {
		const r = await request<{ data: Destination[] }>(f, '/api/destinations', {
			'filters[slug][$eq]': slug,
			'pagination[pageSize]': 1,
			'populate[coverImage]': 'true',
			'populate[seo][populate][ogImage]': 'true',
			'populate[tours][populate][coverImage]': 'true',
			'populate[tours][populate][category][fields][0]': 'name',
			'populate[tours][populate][category][fields][1]': 'slug'
		});
		return r.data[0] ?? null;
	});
}

export function getCategories(f: Fetch = fetch): Promise<Category[]> {
	return cached('categories', TTL_LIST, async () => {
		const r = await request<{ data: Category[] }>(f, '/api/categories', {
			'pagination[pageSize]': 100,
			sort: 'name:asc'
		});
		return r.data;
	});
}

export function getTestimonials(f: Fetch = fetch): Promise<Testimonial[]> {
	return cached('testimonials', TTL_LIST, async () => {
		const r = await request<{ data: Testimonial[] }>(f, '/api/testimonials', {
			'populate[tour][fields][0]': 'title',
			'populate[tour][fields][1]': 'slug',
			'pagination[pageSize]': 50
		});
		return r.data;
	});
}

export function getSitemap(f: Fetch = fetch): Promise<Sitemap> {
	return cached('sitemap', TTL_LIST, () => request<Sitemap>(f, '/api/sitemap'));
}

/** Never cached. Resolves (never throws) with {ok, error?}. */
export async function createEnquiry(
	payload: EnquiryPayload,
	f: Fetch = fetch
): Promise<EnquiryResult> {
	try {
		const res = await f(buildUrl('/api/enquiries'), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify({ data: { ...payload, website: '', source: 'website' } })
		});
		if (res.ok) return { ok: true };
		if (res.status === 429)
			return { ok: false, error: 'Too many requests. Please try again in a few minutes.' };
		let message = 'Could not send your enquiry. Please try again.';
		try {
			const body = await res.json();
			if (res.status === 400 && body?.error?.message) message = String(body.error.message);
		} catch {
			/* ignore */
		}
		return { ok: false, error: message };
	} catch {
		return { ok: false, error: 'Could not reach the server. Please try again.' };
	}
}
