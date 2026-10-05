<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Img from '$lib/components/Img.svelte';
	import TourCard from '$lib/components/TourCard.svelte';
	import Map from '$lib/components/Map.svelte';
	import { destinationJsonLd } from '$lib/seo';
	import { page } from '$app/state';

	let { data } = $props();
	const d = $derived(data.destination);
	// Latitude/longitude are optional extras on the destination (not in the base schema).
	const geo = $derived(d as unknown as { latitude?: number | null; longitude?: number | null });
</script>

<Seo
	title={d.seo?.metaTitle ?? d.name}
	description={d.seo?.metaDescription ?? d.summary ?? ''}
	image={(d.seo?.ogImage ?? d.coverImage)?.url}
	path="/destinations/{d.slug}"
	jsonLd={destinationJsonLd(d, page.url.origin)}
/>

<section class="relative isolate bg-neutral-900 text-white">
	{#if d.coverImage}
		<Img src={d.coverImage} alt={d.coverImage.alternativeText ?? d.name} class="absolute inset-0 -z-10 h-full w-full object-cover opacity-50" priority sizes="100vw" />
	{/if}
	<div class="mx-auto max-w-6xl px-4 py-20">
		{#if d.region}<p class="text-sm uppercase tracking-wide text-white/80">{d.region}</p>{/if}
		<h1 class="mt-2 text-4xl font-bold sm:text-5xl">{d.name}</h1>
		{#if d.summary}<p class="mt-3 max-w-2xl text-lg text-white/85">{d.summary}</p>{/if}
	</div>
</section>

<div class="mx-auto max-w-6xl space-y-12 px-4 py-12">
	{#if data.descriptionHtml}
		<section class="max-w-3xl [&_a]:underline [&_p]:mb-4">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.descriptionHtml}
		</section>
	{/if}

	{#if geo.latitude != null && geo.longitude != null}
		<Map markers={[{ lat: geo.latitude, lng: geo.longitude, label: d.name }]} center={[geo.latitude, geo.longitude]} zoom={9} class="h-80 w-full rounded-lg" label={d.name} />
	{/if}

	{#if d.tours?.length}
		<section>
			<h2 class="text-2xl font-semibold">Tours in {d.name}</h2>
			<div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each d.tours as tour (tour.slug)}<TourCard {tour} />{/each}
			</div>
		</section>
	{/if}
</div>
