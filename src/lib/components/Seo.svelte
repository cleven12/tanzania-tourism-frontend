<script lang="ts">
	import { page } from '$app/state';
	import { serializeJsonLd, absoluteUrl } from '$lib/seo';

	let {
		title,
		description = '',
		image,
		jsonLd,
		path
	}: {
		title: string;
		description?: string;
		image?: { url: string } | string | null;
		jsonLd?: unknown | unknown[];
		path: string;
	} = $props();

	const canonical = $derived(page.url.origin + path);
	const img = $derived(absoluteUrl(image, page.url.origin));
	const ld = $derived(jsonLd ? serializeJsonLd(jsonLd) : '');
</script>

<svelte:head>
	<title>{title}</title>
	{#if description}<meta name="description" content={description} />{/if}
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	{#if description}<meta property="og:description" content={description} />{/if}
	<meta property="og:url" content={canonical} />
	{#if img}<meta property="og:image" content={img} />{/if}
	<meta name="twitter:card" content={img ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={title} />
	{#if description}<meta name="twitter:description" content={description} />{/if}
	{#if img}<meta name="twitter:image" content={img} />{/if}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- ld is serializeJsonLd output ("<" escaped) -->
	{#if ld}{@html '<' + 'script type="application/ld+json">' + ld + '<' + '/script>'}{/if}
</svelte:head>
