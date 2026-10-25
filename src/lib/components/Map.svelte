<script lang="ts">
	import { onMount } from 'svelte';

	interface MapMarker {
		lat: number;
		lng: number;
		label?: string;
	}

	let {
		markers = [],
		lat,
		lng,
		center = [-6.369, 34.889],
		zoom = 6,
		class: className = '',
		label = 'Map'
	}: {
		markers?: MapMarker[];
		lat?: number | null;
		lng?: number | null;
		center?: [number, number];
		zoom?: number;
		class?: string;
		label?: string;
	} = $props();

	let el: HTMLDivElement;

	onMount(() => {
		let map: import('leaflet').Map | undefined;
		let cancelled = false;

		(async () => {
			const [{ default: L }] = await Promise.all([
				import('leaflet'),
				import('leaflet/dist/leaflet.css')
			]);
			if (cancelled) return;

			map = L.map(el, { scrollWheelZoom: false }).setView(center, zoom);
			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 18,
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);

			const icon = L.divIcon({
				className: '',
				html: '<span style="display:block;width:16px;height:16px;border-radius:50%;background:#b45309;border:2px solid #fff;box-shadow:0 0 3px rgba(0,0,0,.5)"></span>',
				iconSize: [16, 16],
				iconAnchor: [8, 8]
			});
			const pts: [number, number][] = [];
			const all = [...markers];
			if (lat != null && lng != null) all.push({ lat, lng, label });
			for (const m of all) {
				const mk = L.marker([m.lat, m.lng], { icon, title: m.label }).addTo(map);
				if (m.label) mk.bindPopup(m.label);
				pts.push([m.lat, m.lng]);
			}
			if (pts.length > 1) map.fitBounds(pts, { padding: [30, 30] });
			else if (pts.length === 1) map.setView(pts[0], Math.max(zoom, 8));
		})();

		return () => {
			cancelled = true;
			map?.remove();
		};
	});
</script>

<div
	bind:this={el}
	role="region"
	aria-label={label}
	class="z-0 h-80 w-full overflow-hidden rounded-lg bg-muted {className}"
></div>
