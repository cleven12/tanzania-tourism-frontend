<script lang="ts">
	type MediaLike = {
		url: string;
		alternativeText?: string | null;
		width?: number | null;
		height?: number | null;
	};
	interface Props {
		src: string | MediaLike | undefined | null;
		alt: string;
		width?: number;
		height?: number;
		sizes?: string;
		class?: string;
		priority?: boolean;
	}
	let {
		src,
		alt,
		width,
		height,
		sizes = '100vw',
		class: className = '',
		priority = false
	}: Props = $props();

	const WIDTHS = [320, 640, 960, 1280, 1920];

	// Media urls should already be absolute (server mediaUrl()); relative ones are used as-is.
	const abs = (u: string) => u;

	const raw = $derived(src ? abs(typeof src === 'string' ? src : src.url) : '/hero-fallback.svg');
	const isLocal = $derived(raw.startsWith('/') && !raw.startsWith('//'));
	const optimize = $derived(
		!import.meta.env.DEV && !isLocal && !raw.startsWith('data:') && !raw.endsWith('.svg')
	);
	const make = (w: number) => `/_vercel/image?url=${encodeURIComponent(raw)}&w=${w}&q=75`;
	const srcset = $derived(optimize ? WIDTHS.map((w) => `${make(w)} ${w}w`).join(', ') : undefined);
	const w = $derived(
		width ?? (typeof src === 'object' && src ? (src.width ?? undefined) : undefined)
	);
	const h = $derived(
		height ?? (typeof src === 'object' && src ? (src.height ?? undefined) : undefined)
	);
</script>

<img
	src={optimize ? make(960) : raw}
	{srcset}
	sizes={optimize ? sizes : undefined}
	{alt}
	width={w}
	height={h}
	loading={priority ? 'eager' : 'lazy'}
	fetchpriority={priority ? 'high' : undefined}
	decoding="async"
	class={className}
/>
