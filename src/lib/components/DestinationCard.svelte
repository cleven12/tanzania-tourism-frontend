<script lang="ts">
	import Img from './Img.svelte';
	import type { Destination } from '$lib/types';

	let { destination }: { destination: Destination } = $props();
</script>

<a
	href="/destinations/{destination.slug}"
	class="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
>
	<Img
		src={destination.coverImage}
		alt={destination.coverImage?.alternativeText || destination.name}
		sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
		class="size-full object-cover transition duration-500 group-hover:scale-105"
	/>
	<div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"></div>
	<div class="absolute inset-x-0 bottom-0 p-4 text-white">
		{#if destination.region}
			<p class="text-xs tracking-wider uppercase opacity-90">{destination.region}</p>
		{/if}
		<h3 class="text-xl font-semibold">{destination.name}</h3>
		{#if destination.summary}
			<p class="mt-1 line-clamp-2 text-sm opacity-90">{destination.summary}</p>
		{/if}
	</div>
</a>
