export interface Media {
	url: string;
	alternativeText?: string | null;
	width?: number | null;
	height?: number | null;
	caption?: string | null;
}

export interface Seo {
	metaTitle?: string | null;
	metaDescription?: string | null;
	canonicalUrl?: string | null;
	keywords?: string | null;
	focusKeyword?: string | null;
	schemaType?: string | null;
	ogImage?: Media | null;
}

export interface Category {
	id: number;
	documentId: string;
	name: string;
	slug: string;
	description?: string | null;
	tours?: Tour[];
}

export interface Destination {
	id: number;
	documentId: string;
	name: string;
	slug: string;
	summary?: string | null;
	description?: string | null;
	region?: string | null;
	coverImage?: Media | null;
	tours?: Tour[];
	seo?: Seo | null;
}

export interface ItineraryDay {
	id?: number;
	dayNumber: number;
	title: string;
	description?: string | null;
	accommodation?: string | null;
}

export interface ListItem {
	id?: number;
	text: string;
}

export interface Faq {
	id?: number;
	question: string;
	answer: string;
}

export type Difficulty = 'easy' | 'moderate' | 'challenging' | 'strenuous' | (string & {});

export interface Tour {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	summary?: string | null;
	description?: string | null;
	durationDays?: number | null;
	priceFrom?: number | null;
	currency?: string | null;
	difficulty?: Difficulty | null;
	groupSizeMin?: number | null;
	groupSizeMax?: number | null;
	highlights?: ListItem[];
	inclusions?: ListItem[];
	exclusions?: ListItem[];
	itinerary?: ItineraryDay[];
	faqs?: Faq[];
	coverImage?: Media | null;
	gallery?: Media[] | null;
	destination?: Destination | null;
	category?: Category | null;
	featured?: boolean;
	seo?: Seo | null;
	updatedAt?: string;
}

export interface Testimonial {
	id: number;
	documentId: string;
	author: string;
	country?: string | null;
	rating?: number | null;
	quote: string;
	tour?: Tour | null;
}

export interface SiteSetting {
	siteName: string;
	tagline?: string | null;
	contactEmail?: string | null;
	contactPhone?: string | null;
	whatsapp?: string | null;
	address?: string | null;
	facebook?: string | null;
	instagram?: string | null;
	youtube?: string | null;
	logo?: Media | null;
	seo?: Seo | null;
}

export interface SearchResult {
	type: 'tour' | 'destination' | 'category';
	title: string;
	slug: string;
	summary?: string | null;
	cover?: Media | string | null;
}

export interface Pagination {
	page: number;
	pageSize: number;
	pageCount: number;
	total: number;
}

export interface Paginated<T> {
	data: T[];
	meta: { pagination: Pagination };
}

export interface SitemapEntry {
	slug: string;
	updatedAt: string;
}

export interface Sitemap {
	tours: SitemapEntry[];
	destinations: SitemapEntry[];
	categories: SitemapEntry[];
}

export interface EnquiryPayload {
	name: string;
	email: string;
	message: string;
	phone?: string;
	travelers?: number;
	travelDates?: string;
	/** Numeric Strapi id of the tour (relation). */
	tour?: number;
}

export interface EnquiryResult {
	ok: boolean;
	error?: string;
}
