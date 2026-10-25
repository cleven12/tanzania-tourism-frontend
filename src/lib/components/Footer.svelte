<script lang="ts">
	import type { SiteSetting } from '$lib/types';

	let { site }: { site: SiteSetting } = $props();
	const year = new Date().getFullYear();
	const social = $derived(
		[
			{ label: 'Facebook', href: site.facebook },
			{ label: 'Instagram', href: site.instagram },
			{ label: 'YouTube', href: site.youtube }
		].filter((s) => s.href)
	);
</script>

<footer class="mt-16 bg-primary text-primary-foreground">
	<div class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
		<div>
			<p class="text-lg font-bold">{site.siteName}</p>
			{#if site.tagline}<p class="mt-2 text-sm opacity-80">{site.tagline}</p>{/if}
		</div>
		<nav aria-label="Footer">
			<p class="mb-3 text-sm font-semibold tracking-wider uppercase opacity-70">Explore</p>
			<ul class="space-y-2 text-sm">
				<li><a class="hover:underline" href="/tours">Tours</a></li>
				<li><a class="hover:underline" href="/destinations">Destinations</a></li>
				<li><a class="hover:underline" href="/about">About</a></li>
				<li><a class="hover:underline" href="/contact">Contact</a></li>
			</ul>
		</nav>
		<div>
			<p class="mb-3 text-sm font-semibold tracking-wider uppercase opacity-70">Get in touch</p>
			<ul class="space-y-2 text-sm">
				{#if site.contactEmail}
					<li>
						<a class="hover:underline" href="mailto:{site.contactEmail}">{site.contactEmail}</a>
					</li>
				{/if}
				{#if site.contactPhone}
					<li>
						<a class="hover:underline" href="tel:{site.contactPhone.replace(/\s/g, '')}"
							>{site.contactPhone}</a
						>
					</li>
				{/if}
				{#if site.whatsapp}
					<li>
						<a
							class="hover:underline"
							href="https://wa.me/{site.whatsapp.replace(/\D/g, '')}"
							rel="noopener">WhatsApp</a
						>
					</li>
				{/if}
				{#if site.address}<li class="whitespace-pre-line opacity-80">{site.address}</li>{/if}
			</ul>
			{#if social.length}
				<ul class="mt-4 flex gap-4 text-sm">
					{#each social as s (s.label)}
						<li>
							<a
								class="underline-offset-4 hover:underline"
								href={s.href}
								rel="noopener noreferrer"
								target="_blank">{s.label}</a
							>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
	<div class="border-t border-white/15">
		<div
			class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs opacity-80 sm:px-6 md:flex-row md:justify-between"
		>
			<p>&copy; {year} {site.siteName}. All prices in USD.</p>
			<p>
				Need the Pro version or a custom build? Contact:
				<a class="underline" href="mailto:clevengodsontech@gmail.com">clevengodsontech@gmail.com</a>
			</p>
		</div>
	</div>
</footer>
