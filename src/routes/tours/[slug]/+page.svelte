<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import Seo from '$lib/components/Seo.svelte';
	import Img from '$lib/components/Img.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import EnquiryForm from '$lib/components/EnquiryForm.svelte';
	import { tourJsonLd } from '$lib/seo';
	import { page } from '$app/state';

	let { data } = $props();
	const tour = $derived(data.tour);
	const gallery = $derived(
		(tour.gallery ?? []) as {
			url: string;
			alternativeText?: string;
			width?: number;
			height?: number;
		}[]
	);
	let lightboxIndex = $state<number | null>(null);
</script>

<Seo
	title={tour.seo?.metaTitle ?? tour.title}
	description={tour.seo?.metaDescription ?? tour.summary ?? ''}
	image={(tour.seo?.ogImage ?? tour.coverImage)?.url}
	path="/tours/{tour.slug}"
	jsonLd={tourJsonLd(tour, page.url.origin)}
/>

<section class="relative isolate bg-neutral-900 text-white">
	{#if tour.coverImage}
		<Img
			src={tour.coverImage}
			alt={tour.coverImage.alternativeText ?? tour.title}
			class="absolute inset-0 -z-10 h-full w-full object-cover opacity-50"
			priority
			sizes="100vw"
		/>
	{/if}
	<div class="mx-auto max-w-6xl px-4 py-20">
		<p class="text-sm tracking-wide text-white/80 uppercase">
			{#if tour.destination}<a href="/destinations/{tour.destination.slug}" class="hover:underline"
					>{tour.destination.name}</a
				>{/if}
			{#if tour.category}
				· {tour.category.name}{/if}
		</p>
		<h1 class="mt-2 text-4xl font-bold sm:text-5xl">{tour.title}</h1>
		{#if tour.summary}<p class="mt-3 max-w-2xl text-lg text-white/85">{tour.summary}</p>{/if}
	</div>
</section>

<div class="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_340px]">
	<div class="min-w-0 space-y-12">
		<dl class="flex flex-wrap gap-x-8 gap-y-3 rounded-lg border p-4 text-sm">
			{#if tour.durationDays}<div>
					<dt class="text-neutral-500">Duration</dt>
					<dd class="font-medium">{tour.durationDays} days</dd>
				</div>{/if}
			{#if tour.difficulty}<div>
					<dt class="text-neutral-500">Difficulty</dt>
					<dd class="font-medium capitalize">{tour.difficulty}</dd>
				</div>{/if}
			{#if tour.groupSizeMin || tour.groupSizeMax}
				<div>
					<dt class="text-neutral-500">Group size</dt>
					<dd class="font-medium">
						{tour.groupSizeMin ?? 1}{tour.groupSizeMax ? `–${tour.groupSizeMax}` : '+'}
					</dd>
				</div>
			{/if}
		</dl>

		{#if data.descriptionHtml}
			<section class="prose max-w-none [&_a]:underline [&_p]:mb-4">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html data.descriptionHtml}
			</section>
		{/if}

		{#if tour.highlights?.length}
			<section>
				<h2 class="text-2xl font-semibold">Highlights</h2>
				<ul class="mt-4 list-disc space-y-1 pl-5">
					{#each tour.highlights as h, hi (hi)}<li>{h.text}</li>{/each}
				</ul>
			</section>
		{/if}

		{#if tour.itinerary?.length}
			<section>
				<h2 class="text-2xl font-semibold">Itinerary</h2>
				<Accordion.Root type="single" class="mt-4">
					{#each tour.itinerary as day (day.dayNumber)}
						<Accordion.Item value="day-{day.dayNumber}">
							<Accordion.Trigger>Day {day.dayNumber}: {day.title}</Accordion.Trigger>
							<Accordion.Content>
								{#if day.description}<p class="whitespace-pre-line">{day.description}</p>{/if}
								{#if day.accommodation}<p class="mt-2 text-sm text-neutral-600">
										Stay: {day.accommodation}
									</p>{/if}
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
			</section>
		{/if}

		{#if tour.inclusions?.length || tour.exclusions?.length}
			<section class="grid gap-8 sm:grid-cols-2">
				{#if tour.inclusions?.length}
					<div>
						<h2 class="text-2xl font-semibold">Included</h2>
						<ul class="mt-4 space-y-1">
							{#each tour.inclusions as i, n (n)}<li class="flex gap-2">
									<span class="text-green-600" aria-hidden="true">✓</span>{i.text}
								</li>{/each}
						</ul>
					</div>
				{/if}
				{#if tour.exclusions?.length}
					<div>
						<h2 class="text-2xl font-semibold">Not included</h2>
						<ul class="mt-4 space-y-1">
							{#each tour.exclusions as i, n (n)}<li class="flex gap-2">
									<span class="text-red-600" aria-hidden="true">✕</span>{i.text}
								</li>{/each}
						</ul>
					</div>
				{/if}
			</section>
		{/if}

		{#if gallery.length}
			<section>
				<h2 class="mb-4 text-2xl font-semibold">Gallery</h2>
				<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
					{#each gallery as img, i (img.url)}
						<button
							type="button"
							class="aspect-[4/3] overflow-hidden rounded-md"
							onclick={() => (lightboxIndex = i)}
							aria-label="Open photo {i + 1}"
						>
							<Img
								src={img}
								alt={img.alternativeText ?? `${tour.title} photo ${i + 1}`}
								class="h-full w-full object-cover"
								sizes="(min-width: 640px) 33vw, 50vw"
							/>
						</button>
					{/each}
				</div>
				<Lightbox images={gallery} bind:index={lightboxIndex} alt={tour.title} />
			</section>
		{/if}

		{#if tour.faqs?.length}
			<section>
				<h2 class="text-2xl font-semibold">FAQ</h2>
				<Accordion.Root type="single" class="mt-4">
					{#each tour.faqs as faq, i (i)}
						<Accordion.Item value="faq-{i}">
							<Accordion.Trigger>{faq.question}</Accordion.Trigger>
							<Accordion.Content><p class="whitespace-pre-line">{faq.answer}</p></Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
			</section>
		{/if}
	</div>

	<aside class="lg:sticky lg:top-24 lg:self-start">
		<div class="rounded-lg border p-5 shadow-sm">
			{#if tour.priceFrom}
				<p class="text-sm text-neutral-500">From</p>
				<p class="text-3xl font-bold">
					{new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: tour.currency || 'USD',
						maximumFractionDigits: 0
					}).format(tour.priceFrom)}
					<span class="text-sm font-normal text-neutral-500">per person</span>
				</p>
			{/if}
			<a
				href="#enquire"
				class="mt-4 block rounded-md bg-neutral-900 py-2 text-center font-medium text-white"
				>Enquire now</a
			>
		</div>
	</aside>
</div>

<section id="enquire" class="bg-neutral-50 py-14">
	<div class="mx-auto max-w-2xl px-4">
		<h2 class="text-2xl font-semibold">Enquire about this tour</h2>
		<div class="mt-6"><EnquiryForm tourId={tour.id} tourTitle={tour.title} /></div>
	</div>
</section>
