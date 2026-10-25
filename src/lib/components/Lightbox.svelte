<script lang="ts">
	import { tick } from 'svelte';
	import Img from '$lib/components/Img.svelte';

	import type { Media } from '$lib/types';

	let {
		images,
		index = $bindable(null),
		alt = 'Photo',
		class: className = 'grid grid-cols-2 gap-3 sm:grid-cols-3'
	}: { images: Media[]; index?: number | null; alt?: string; class?: string } = $props();

	let dialog: HTMLDivElement | undefined = $state();
	let opener: HTMLElement | null = null;
	let touchX = 0;

	const open = $derived(index !== null && images.length > 0);
	const current = $derived(index !== null ? images[index] : undefined);

	function close() {
		index = null;
	}
	function step(d: number) {
		if (index === null) return;
		index = (index + d + images.length) % images.length;
	}

	$effect(() => {
		if (open) {
			opener = document.activeElement as HTMLElement | null;
			const prev = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			tick().then(() => dialog?.querySelector<HTMLElement>('button')?.focus());
			return () => {
				document.body.style.overflow = prev;
				opener?.focus?.();
			};
		}
	});

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') return close();
		if (e.key === 'ArrowRight') return step(1);
		if (e.key === 'ArrowLeft') return step(-1);
		if (e.key === 'Tab' && dialog) {
			const f = [...dialog.querySelectorAll<HTMLElement>('button:not([disabled])')];
			if (!f.length) return;
			const first = f[0];
			const last = f[f.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}
</script>

<ul class={className}>
	{#each images as image, i (image.url + i)}
		<li>
			<button
				type="button"
				class="block aspect-[4/3] w-full overflow-hidden rounded-lg"
				aria-label="Open image {i + 1} of {images.length}"
				onclick={() => (index = i)}
			>
				<Img
					src={image}
					alt={image.alternativeText || `${alt} ${i + 1}`}
					width={640}
					sizes="(min-width:640px) 33vw, 50vw"
					class="h-full w-full object-cover"
				/>
			</button>
		</li>
	{/each}
</ul>

{#if open && current}
	<div
		bind:this={dialog}
		role="dialog"
		aria-modal="true"
		aria-label="Image viewer"
		tabindex="-1"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
		{onkeydown}
		ontouchstart={(e) => (touchX = e.changedTouches[0].clientX)}
		ontouchend={(e) => {
			const dx = e.changedTouches[0].clientX - touchX;
			if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
		}}
	>
		<button
			type="button"
			class="absolute inset-0 cursor-default"
			aria-label="Close"
			tabindex="-1"
			onclick={close}
		></button>

		<button
			type="button"
			class="absolute top-4 right-4 z-10 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20"
			onclick={close}
			aria-label="Close image viewer">✕</button
		>

		{#if images.length > 1}
			<button
				type="button"
				class="absolute left-3 z-10 rounded-full bg-white/10 px-4 py-3 text-2xl text-white hover:bg-white/20"
				onclick={() => step(-1)}
				aria-label="Previous image">‹</button
			>
			<button
				type="button"
				class="absolute right-3 z-10 rounded-full bg-white/10 px-4 py-3 text-2xl text-white hover:bg-white/20"
				onclick={() => step(1)}
				aria-label="Next image">›</button
			>
		{/if}

		<figure class="pointer-events-none relative z-0 m-0 max-h-[90vh] max-w-[92vw]">
			<Img
				src={current}
				alt={current.alternativeText || `${alt} ${index! + 1}`}
				sizes="92vw"
				priority
				class="max-h-[90vh] w-auto max-w-[92vw] object-contain"
			/>
			<figcaption class="mt-2 text-center text-sm text-white/80" aria-live="polite">
				{index! + 1} / {images.length}
			</figcaption>
		</figure>
	</div>
{/if}
