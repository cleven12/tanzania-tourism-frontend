<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	let { data } = $props();
	const site = $derived(data.site);
</script>

<Seo
	title="About us"
	description="Local Tanzania experts crafting safaris, treks and beach escapes."
	path="/about"
/>
<div class="mx-auto max-w-3xl px-4 py-12">
	<SectionHeading title="About {site?.siteName ?? 'us'}" subtitle={site?.tagline ?? undefined} />
	<div class="mt-6 space-y-4 text-neutral-700">
		<p>
			We are a Tanzania-based team of guides and trip planners. We know the parks, the mountains and
			the coast first-hand, and we build every itinerary around the way you want to travel.
		</p>
		<p>
			From a first safari in the Serengeti to a Kilimanjaro summit push or a quiet week on Zanzibar,
			our local guides handle the details so you can enjoy the journey.
		</p>
	</div>
	<a href="/tours" class="mt-8 inline-block rounded-md bg-neutral-900 px-5 py-3 text-white"
		>Explore tours</a
	>
</div>
