<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface Props {
		title: string;
		eyebrow?: string;
		subtitle?: string;
		align?: 'left' | 'center';
		as?: 'h1' | 'h2' | 'h3';
		class?: string;
		children?: Snippet;
	}
	let {
		title,
		eyebrow,
		subtitle,
		align = 'left',
		as = 'h2',
		class: className,
		children
	}: Props = $props();
</script>

<div class={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
	{#if eyebrow}
		<p class="mb-2 text-sm font-semibold tracking-widest text-terracotta uppercase">{eyebrow}</p>
	{/if}
	<svelte:element
		this={as}
		class="text-3xl font-bold tracking-tight text-balance text-primary sm:text-4xl"
	>
		{title}
	</svelte:element>
	{#if subtitle}
		<p class="mt-3 text-lg text-muted-foreground">{subtitle}</p>
	{/if}
	{@render children?.()}
</div>
