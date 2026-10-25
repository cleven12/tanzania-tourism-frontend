import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TtlCache, cache } from './cache';
import { createEnquiry, getTour, getTours, mediaUrl } from './api';

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

describe('TtlCache', () => {
	it('caches within TTL, reloads after, serves stale on error, never caches errors', async () => {
		let t = 0;
		const c = new TtlCache(() => t);
		const loader = vi.fn().mockResolvedValue('a');
		expect(await c.get('k', 60, loader)).toBe('a');
		expect(await c.get('k', 60, loader)).toBe('a');
		expect(loader).toHaveBeenCalledTimes(1);
		t = 61_000;
		const failing = vi.fn().mockRejectedValue(new Error('x'));
		expect(await c.get('k', 60, failing)).toBe('a');
		await expect(c.get('fresh', 60, failing)).rejects.toThrow();
		const ok = vi.fn().mockResolvedValue('b');
		expect(await c.get('fresh', 60, ok)).toBe('b');
	});
});

describe('api', () => {
	beforeEach(() => cache.clear());

	it('mediaUrl makes absolute URLs', () => {
		expect(mediaUrl('/uploads/a.jpg')).toMatch(/^https?:\/\/.+\/uploads\/a\.jpg$/);
		expect(mediaUrl({ url: 'https://x.test/a.jpg' })).toBe('https://x.test/a.jpg');
		expect(mediaUrl(undefined)).toBe('');
	});

	it('getTour populates deeply and caches', async () => {
		const f = vi.fn(async () => json({ data: [{ id: 1, slug: 'k', title: 'K' }] }));
		const t = await getTour('k', f as unknown as typeof fetch);
		await getTour('k', f as unknown as typeof fetch);
		expect(t?.slug).toBe('k');
		expect(f).toHaveBeenCalledTimes(1);
		const url = decodeURIComponent((f.mock.calls[0] as unknown[])[0] as string);
		for (const p of [
			'filters[slug][$eq]=k',
			'populate[gallery]',
			'populate[faqs]',
			'populate[seo][populate][ogImage]',
			'populate[itinerary]'
		])
			expect(url).toContain(p);
	});

	it('getTours with q searches then filters by slugs', async () => {
		const f = vi.fn(async (u: string) =>
			u.includes('/api/search')
				? json({
						data: [
							{ type: 'tour', slug: 'b', title: 'B' },
							{ type: 'tour', slug: 'a', title: 'A' }
						]
					})
				: json({
						data: [{ slug: 'a' }, { slug: 'b' }],
						meta: { pagination: { page: 1, pageSize: 12, pageCount: 1, total: 2 } }
					})
		);
		const r = await getTours({ q: 'kili', category: 'treks' }, f as unknown as typeof fetch);
		expect(r.data.map((t) => t.slug)).toEqual(['b', 'a']);
		const url = decodeURIComponent((f.mock.calls[1] as unknown[])[0] as string);
		expect(url).toContain('filters[category][slug][$eq]=treks');
		expect(url).toContain('filters[slug][$in][0]=b');
	});

	it('createEnquiry posts honeypot+source and maps errors', async () => {
		const f = vi.fn(async () => json({}, 200));
		expect(
			await createEnquiry(
				{ name: 'J', email: 'j@x.co', message: 'hi' },
				f as unknown as typeof fetch
			)
		).toEqual({ ok: true });
		const init = (f.mock.calls[0] as unknown[])[1] as RequestInit;
		expect(JSON.parse(init.body as string)).toEqual({
			data: { name: 'J', email: 'j@x.co', message: 'hi', website: '', source: 'website' }
		});
		const r = await createEnquiry({ name: 'J', email: 'j@x.co', message: 'hi' }, (async () =>
			json({}, 429)) as unknown as typeof fetch);
		expect(r.ok).toBe(false);
		expect(r.error).toBeTruthy();
	});
});
