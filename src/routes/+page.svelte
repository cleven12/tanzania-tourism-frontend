<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Img from '$lib/components/Img.svelte';
	import TourCard from '$lib/components/TourCard.svelte';
	import DestinationCard from '$lib/components/DestinationCard.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import { organizationJsonLd } from '$lib/seo';
	import { page } from '$app/state';

	let { data } = $props();
	const site = $derived(data.site);
	const hero = $derived(data.tours[0]?.coverImage ?? data.destinations[0]?.coverImage);
</script>

<Seo
	title={site?.seo?.metaTitle ?? site?.siteName ?? 'Tanzania Tours'}
	description={site?.seo?.metaDescription ?? site?.tagline ?? 'Tours and safaris in Tanzania'}
	path="/"
	jsonLd={site ? organizationJsonLd(site, page.url.origin) : undefined}
/>

<section class="relative isolate overflow-hidden bg-neutral-900 text-white">
	{#if hero}
		<Img
			src={hero}
			alt=""
			class="absolute inset-0 -z-10 h-full w-full object-cover opacity-50"
			priority
			sizes="100vw"
		/>
	{/if}
	<div class="mx-auto max-w-6xl px-4 py-24 sm:py-36">
		<h1 class="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
			{site?.tagline ?? 'Discover Tanzania'}
		</h1>
		<p class="mt-4 max-w-2xl text-lg text-white/85">
			Safaris, mountain treks and beach escapes with local expert guides.
		</p>
		<div class="mt-8 flex flex-wrap gap-3">
			<a
				href="/tours"
				class="rounded-md bg-white px-5 py-3 font-medium text-neutral-900 hover:bg-neutral-100"
				>Browse tours</a
			>
			<a
				href="/contact"
				class="rounded-md border border-white/70 px-5 py-3 font-medium hover:bg-white/10"
				>Plan my trip</a
			>
		</div>
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 py-16">
	<SectionHeading title="Featured tours" subtitle="Our most popular itineraries" />
	<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.tours as tour (tour.slug)}
			<TourCard {tour} />
		{/each}
	</div>
	<div class="mt-8 text-center">
		<a href="/tours" class="font-medium underline">View all tours</a>
	</div>
</section>

{#if data.destinations.length}
	<section class="bg-neutral-50 py-16">
		<div class="mx-auto max-w-6xl px-4">
			<SectionHeading title="Destinations" subtitle="Where we take you" />
			<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.destinations.slice(0, 6) as destination (destination.slug)}
					<DestinationCard {destination} />
				{/each}
			</div>
		</div>
	</section>
{/if}

{#if data.testimonials.length}
	<section class="mx-auto max-w-6xl px-4 py-16">
		<SectionHeading title="What travelers say" />
		<div class="mt-8 grid gap-6 md:grid-cols-3">
			{#each data.testimonials.slice(0, 3) as t (t.id ?? t.author)}
				<figure class="rounded-lg border p-6">
					{#if t.rating}<div class="text-amber-500" aria-label="{t.rating} out of 5">
							{'★'.repeat(t.rating)}
						</div>{/if}
					<blockquote class="mt-2 text-neutral-700">“{t.quote}”</blockquote>
					<figcaption class="mt-4 text-sm font-medium">
						{t.author}{t.country ? `, ${t.country}` : ''}
					</figcaption>
				</figure>
			{/each}
		</div>
	</section>
{/if}

<section class="bg-neutral-900 py-16 text-center text-white">
	<div class="mx-auto max-w-2xl px-4">
		<h2 class="text-3xl font-bold">Ready for your Tanzania adventure?</h2>
		<p class="mt-3 text-white/80">
			Tell us what you have in mind and we will build the trip around you.
		</p>
		<a
			href="/contact"
			class="mt-6 inline-block rounded-md bg-white px-6 py-3 font-medium text-neutral-900"
			>Get in touch</a
		>
	</div>
</section>
