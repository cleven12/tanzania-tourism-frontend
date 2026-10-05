<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import EnquiryForm from '$lib/components/EnquiryForm.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	let { data } = $props();
	const site = $derived(data.site as any);
	const email = $derived(site?.contactEmail ?? site?.email);
	const phone = $derived(site?.contactPhone ?? site?.phone);
	const whatsapp = $derived(site?.whatsapp ?? site?.whatsappNumber);
	const waDigits = $derived(whatsapp ? String(whatsapp).replace(/\D/g, '') : '');
</script>

<Seo title="Contact" description="Get in touch to plan your Tanzania trip." path="/contact" />
<div class="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1fr_1.2fr]">
	<div>
		<SectionHeading title="Contact us" subtitle="We usually reply within one business day." />
		<ul class="mt-6 space-y-3">
			{#if email}<li>Email: <a class="underline" href="mailto:{email}">{email}</a></li>{/if}
			{#if phone}<li>Phone: <a class="underline" href="tel:{phone}">{phone}</a></li>{/if}
			{#if site?.address}<li>{site.address}</li>{/if}
			{#if waDigits}
				<li><a class="inline-block rounded-md bg-green-600 px-4 py-2 text-white" href="https://wa.me/{waDigits}" rel="noopener" target="_blank">Chat on WhatsApp</a></li>
			{/if}
		</ul>
	</div>
	<div><EnquiryForm /></div>
</div>
