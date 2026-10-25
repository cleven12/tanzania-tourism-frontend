<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import DestinationCard from '$lib/components/DestinationCard.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	let { data } = $props();
</script>

<Seo title="Destinations" description="Explore Tanzania's top destinations." path="/destinations" />
<div class="mx-auto max-w-6xl px-4 py-12">
	<SectionHeading title="Destinations" subtitle="Explore Tanzania" />
	<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.destinations as destination (destination.slug)}
			<DestinationCard {destination} />
		{/each}
	</div>
</div>
