<script lang="ts">
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import Seo from '$lib/components/Seo.svelte';
	import TourCard from '$lib/components/TourCard.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';

	let { data } = $props();
	const f = $derived(data.filters);
	const pagination = $derived(data.result.meta?.pagination);

	function href(over: Record<string, string | number | undefined>) {
		const p = new SvelteURLSearchParams();
		const merged = {
			category: f.category,
			destination: f.destination,
			q: f.q,
			page: undefined,
			...over
		};
		for (const [k, v] of Object.entries(merged)) if (v) p.set(k, String(v));
		const s = p.toString();
		return s ? `/tours?${s}` : '/tours';
	}
	const chip = 'rounded-full border px-3 py-1 text-sm hover:bg-neutral-100';
	const active = 'bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-900';
</script>

<Seo title="Tours" description="Browse Tanzania safaris, treks and beach holidays." path="/tours" />

<div class="mx-auto max-w-6xl px-4 py-12">
	<SectionHeading title="Tours" subtitle="Find your Tanzania experience" />

	<form method="GET" action="/tours" class="mt-6 flex gap-2" role="search">
		{#if f.category}<input type="hidden" name="category" value={f.category} />{/if}
		{#if f.destination}<input type="hidden" name="destination" value={f.destination} />{/if}
		<input
			type="search"
			name="q"
			value={f.q ?? ''}
			placeholder="Search tours"
			aria-label="Search tours"
			class="w-full max-w-md rounded-md border px-3 py-2"
		/>
		<button class="rounded-md bg-neutral-900 px-4 py-2 text-white">Search</button>
	</form>

	<div class="mt-6 space-y-3">
		<div class="flex flex-wrap items-center gap-2">
			<span class="text-sm font-medium">Category:</span>
			<a href={href({ category: undefined })} class="{chip} {!f.category ? active : ''}">All</a>
			{#each data.categories as c (c.slug)}
				<a href={href({ category: c.slug })} class="{chip} {f.category === c.slug ? active : ''}"
					>{c.name}</a
				>
			{/each}
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<span class="text-sm font-medium">Destination:</span>
			<a href={href({ destination: undefined })} class="{chip} {!f.destination ? active : ''}"
				>All</a
			>
			{#each data.destinations as d (d.slug)}
				<a
					href={href({ destination: d.slug })}
					class="{chip} {f.destination === d.slug ? active : ''}">{d.name}</a
				>
			{/each}
		</div>
	</div>

	{#if data.result.data.length}
		<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.result.data as tour (tour.slug)}
				<TourCard {tour} />
			{/each}
		</div>
	{:else}
		<p class="mt-12 text-center text-neutral-600">
			No tours match your filters. <a class="underline" href="/tours">Clear filters</a>
		</p>
	{/if}

	{#if pagination && pagination.pageCount > 1}
		<nav class="mt-10 flex items-center justify-center gap-4" aria-label="Pagination">
			{#if pagination.page > 1}<a class={chip} href={href({ page: pagination.page - 1 })} rel="prev"
					>Previous</a
				>{/if}
			<span class="text-sm">Page {pagination.page} of {pagination.pageCount}</span>
			{#if pagination.page < pagination.pageCount}<a
					class={chip}
					href={href({ page: pagination.page + 1 })}
					rel="next">Next</a
				>{/if}
		</nav>
	{/if}
</div>
