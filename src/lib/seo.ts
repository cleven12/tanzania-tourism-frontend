type MediaLike = { url: string } | string | null | undefined;

export interface TourLike {
	title: string;
	slug: string;
	summary?: string | null;
	coverImage?: MediaLike;
	priceFrom?: number | string | null;
	currency?: string | null;
	durationDays?: number | null;
}

export interface DestinationLike {
	name: string;
	slug: string;
	summary?: string | null;
	region?: string | null;
	coverImage?: MediaLike;
}

export interface SiteLike {
	siteName?: string | null;
	tagline?: string | null;
	contactEmail?: string | null;
	contactPhone?: string | null;
	facebook?: string | null;
	instagram?: string | null;
	youtube?: string | null;
	logo?: MediaLike;
}

/** Make a (possibly API-relative) media URL absolute. */
export function absoluteUrl(media: MediaLike, origin: string): string | undefined {
	const url = typeof media === 'string' ? media : media?.url;
	if (!url) return undefined;
	if (/^https?:\/\//i.test(url)) return url;
	return origin.replace(/\/+$/, '') + (url.startsWith('/') ? url : `/${url}`);
}

function clean<T extends Record<string, unknown>>(o: T): T {
	return Object.fromEntries(
		Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== '')
	) as T;
}

export function organizationJsonLd(site: SiteLike | null | undefined, origin: string) {
	const sameAs = [site?.facebook, site?.instagram, site?.youtube].filter(Boolean);
	return clean({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: site?.siteName ?? 'Tanzania Tours',
		url: origin,
		description: site?.tagline ?? undefined,
		logo: absoluteUrl(site?.logo, origin),
		email: site?.contactEmail,
		telephone: site?.contactPhone,
		sameAs: sameAs.length ? sameAs : undefined
	});
}

export function tourJsonLd(tour: TourLike, origin: string) {
	const url = `${origin}/tours/${tour.slug}`;
	const price = tour.priceFrom != null && tour.priceFrom !== '' ? Number(tour.priceFrom) : NaN;
	return clean({
		'@context': 'https://schema.org',
		'@type': 'TouristTrip',
		name: tour.title,
		description: tour.summary,
		url,
		image: absoluteUrl(tour.coverImage, origin),
		touristType: undefined,
		offers: Number.isFinite(price)
			? {
					'@type': 'Offer',
					price,
					priceCurrency: 'USD',
					availability: 'https://schema.org/InStock',
					url
				}
			: undefined
	});
}

export function destinationJsonLd(dest: DestinationLike, origin: string) {
	return clean({
		'@context': 'https://schema.org',
		'@type': 'Place',
		name: dest.name,
		description: dest.summary,
		url: `${origin}/destinations/${dest.slug}`,
		image: absoluteUrl(dest.coverImage, origin),
		address: dest.region
			? { '@type': 'PostalAddress', addressRegion: dest.region, addressCountry: 'TZ' }
			: { '@type': 'PostalAddress', addressCountry: 'TZ' }
	});
}

/** Serialize JSON-LD safely for embedding in a <script> tag. */
export function serializeJsonLd(data: unknown): string {
	return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function escapeXml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}
