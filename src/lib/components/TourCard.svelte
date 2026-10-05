<script lang="ts">
	import Img from './Img.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { formatDuration, formatPrice, titleCase } from '$lib/utils';
	import type { Tour } from '$lib/types';

	let { tour }: { tour: Tour } = $props();
</script>

<article
	class="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-md"
>
	<div class="relative aspect-[4/3] overflow-hidden bg-muted">
		<Img
			src={tour.coverImage}
			alt={tour.coverImage?.alternativeText || tour.title}
			sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
			class="size-full object-cover transition duration-500 group-hover:scale-105"
		/>
		{#if tour.difficulty}
			<Badge variant="secondary" class="absolute top-3 left-3 shadow"
				>{titleCase(tour.difficulty)}</Badge
			>
		{/if}
	</div>
	<div class="flex flex-1 flex-col gap-2 p-4">
		{#if tour.destination?.name}
			<p class="text-xs font-semibold tracking-wider text-terracotta uppercase">
				{tour.destination.name}
			</p>
		{/if}
		<h3 class="text-lg leading-snug font-semibold text-primary">
			<a href="/tours/{tour.slug}" class="after:absolute after:inset-0 focus-visible:outline-none">
				{tour.title}
			</a>
		</h3>
		{#if tour.summary}
			<p class="line-clamp-2 text-sm text-muted-foreground">{tour.summary}</p>
		{/if}
		<div class="mt-auto flex items-end justify-between pt-3">
			<span class="text-sm text-muted-foreground">{formatDuration(tour.durationDays)}</span>
			{#if tour.priceFrom != null}
				<span class="text-right text-sm text-muted-foreground">
					from <strong class="text-lg text-foreground"
						>{formatPrice(tour.priceFrom, tour.currency || 'USD')}</strong
					>
				</span>
			{/if}
		</div>
	</div>
</article>
