<script lang="ts">
	import './layout.css';
	const favicon = '/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/svg+xml" />
</svelte:head>

<a
	href="#main"
	class="sr-only z-[60] rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
>
	Skip to content
</a>
<div class="flex min-h-screen flex-col">
	<Header site={data.site} />
	<main id="main" class="flex-1">
		{@render children()}
	</main>
	<Footer site={data.site} />
</div>
