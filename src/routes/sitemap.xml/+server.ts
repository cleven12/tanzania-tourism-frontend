import type { RequestHandler } from './$types';
import { getSitemap } from '$lib/server/api';
import { escapeXml } from '$lib/seo';

export const prerender = false;

const STATIC_PATHS = ['/', '/tours', '/destinations', '/about', '/contact'];

type Entry = { slug: string; updatedAt?: string };

export const GET: RequestHandler = async ({ url }) => {
	const origin = url.origin;
	const urls: { loc: string; lastmod?: string }[] = STATIC_PATHS.map((p) => ({ loc: origin + p }));

	try {
		const map = (await getSitemap()) as unknown as Record<string, Entry[] | undefined>;
		const groups: [string, string][] = [
			['tours', '/tours/'],
			['destinations', '/destinations/'],
			['categories', '/categories/']
		];
		for (const [key, prefix] of groups) {
			for (const e of map?.[key] ?? []) {
				urls.push({ loc: origin + prefix + encodeURIComponent(e.slug), lastmod: e.updatedAt });
			}
		}
	} catch {
		// API unavailable: still serve static pages
	}

	const body =
		`<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
		urls
			.map(
				(u) =>
					`<url><loc>${escapeXml(u.loc)}</loc>` +
					(u.lastmod ? `<lastmod>${escapeXml(u.lastmod)}</lastmod>` : '') +
					`</url>`
			)
			.join('\n') +
		`\n</urlset>\n`;

	return new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
		}
	});
};
