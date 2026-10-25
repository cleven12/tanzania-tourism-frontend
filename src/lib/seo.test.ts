import { describe, it, expect } from 'vitest';
import {
	tourJsonLd,
	destinationJsonLd,
	organizationJsonLd,
	serializeJsonLd,
	escapeXml
} from './seo';

const origin = 'https://example.com';

describe('seo', () => {
	it('builds TouristTrip with USD offer', () => {
		const ld = tourJsonLd(
			{ title: 'Kili', slug: 'kili', priceFrom: '1500', coverImage: { url: 'https://cdn/x.jpg' } },
			origin
		);
		expect(ld['@type']).toBe('TouristTrip');
		expect(ld.url).toBe('https://example.com/tours/kili');
		expect(ld.offers).toMatchObject({ price: 1500, priceCurrency: 'USD' });
		expect(ld.image).toBe('https://cdn/x.jpg');
	});

	it('omits offers without price', () => {
		expect(tourJsonLd({ title: 'A', slug: 'a' }, origin).offers).toBeUndefined();
	});

	it('builds Place', () => {
		const ld = destinationJsonLd({ name: 'Serengeti', slug: 'serengeti', region: 'Mara' }, origin);
		expect(ld['@type']).toBe('Place');
		expect(ld.url).toBe('https://example.com/destinations/serengeti');
	});

	it('builds Organization', () => {
		const ld = organizationJsonLd({ siteName: 'TZ', facebook: 'https://fb.com/tz' }, origin);
		expect(ld['@type']).toBe('Organization');
		expect(ld.sameAs).toEqual(['https://fb.com/tz']);
	});

	it('escapes < in JSON-LD and XML', () => {
		expect(serializeJsonLd({ a: '</script>' })).not.toContain('<');
		expect(escapeXml('a&b<c')).toBe('a&amp;b&lt;c');
	});
});
