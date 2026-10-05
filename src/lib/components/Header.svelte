<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import Img from './Img.svelte';
	import type { SiteSetting } from '$lib/types';

	let { site }: { site: SiteSetting } = $props();
	let open = $state(false);

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/tours', label: 'Tours' },
		{ href: '/destinations', label: 'Destinations' },
		{ href: '/about', label: 'About' },
		{ href: '/contact', label: 'Contact' }
	];
	const active = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
</script>

<header class="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
		<a href="/" class="flex items-center gap-2 font-bold text-primary">
			{#if site.logo}
				<Img
					src={site.logo}
					alt=""
					priority
					class="size-9 rounded-full object-contain"
					width={36}
					height={36}
				/>
			{:else}
				<img src="/logo.svg" alt="" class="size-9" width="36" height="36" />
			{/if}
			<span class="text-lg">{site.siteName}</span>
		</a>

		<nav aria-label="Main" class="hidden items-center gap-6 md:flex">
			{#each links as l (l.href)}
				<a
					href={l.href}
					aria-current={active(l.href) ? 'page' : undefined}
					class="text-sm font-medium text-foreground/80 transition hover:text-primary aria-[current=page]:text-primary aria-[current=page]:underline aria-[current=page]:decoration-terracotta aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8"
				>
					{l.label}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<Button
				href="/contact"
				class="hidden bg-terracotta text-terracotta-foreground hover:bg-terracotta/90 sm:inline-flex"
				size="lg"
			>
				Plan your trip
			</Button>

			<Sheet.Root bind:open>
				<Sheet.Trigger>
					{#snippet child({ props })}
						<Button
							{...props}
							variant="ghost"
							size="icon-lg"
							class="md:hidden"
							aria-label="Open menu"
						>
							<svg
								viewBox="0 0 24 24"
								class="size-6"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								aria-hidden="true"
							>
								<path d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</Button>
					{/snippet}
				</Sheet.Trigger>
				<Sheet.Content side="right">
					<Sheet.Header>
						<Sheet.Title>{site.siteName}</Sheet.Title>
						<Sheet.Description class="sr-only">Site navigation</Sheet.Description>
					</Sheet.Header>
					<nav aria-label="Mobile" class="flex flex-col gap-1 px-4">
						{#each links as l (l.href)}
							<a
								href={l.href}
								onclick={() => (open = false)}
								aria-current={active(l.href) ? 'page' : undefined}
								class="rounded-md px-3 py-3 text-base font-medium hover:bg-muted aria-[current=page]:bg-accent aria-[current=page]:text-primary"
							>
								{l.label}
							</a>
						{/each}
					</nav>
					<div class="mt-auto p-4">
						<Button
							href="/contact"
							onclick={() => (open = false)}
							size="lg"
							class="h-11 w-full bg-terracotta text-terracotta-foreground hover:bg-terracotta/90"
						>
							Plan your trip
						</Button>
					</div>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</div>
</header>
