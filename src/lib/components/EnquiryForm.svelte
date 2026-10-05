<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';

	let {
		tourId,
		tourTitle,
		class: className = ''
	}: { tourId?: string | number; tourTitle?: string; class?: string } = $props();

	let status = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');
	let errors = $state<Record<string, string>>({});
	let formError = $state('');

	const sentViaRedirect = $derived(page.url.searchParams.get('sent') === '1');
	const failedViaRedirect = $derived(page.url.searchParams.get('error') === '1');

	async function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		status = 'sending';
		errors = {};
		formError = '';
		try {
			const res = await fetch('/enquiry', {
				method: 'POST',
				headers: { accept: 'application/json' },
				body: new FormData(form)
			});
			const data = await res.json().catch(() => ({}));
			if (res.ok && data.ok) {
				status = 'sent';
				form.reset();
			} else {
				errors = data.errors ?? {};
				formError = errors.form ?? '';
				status = 'error';
			}
		} catch {
			formError = 'Network error. Please try again.';
			status = 'error';
		}
	}
</script>

<div id="enquiry" class={className}>
	{#if status === 'sent' || (status === 'idle' && sentViaRedirect)}
		<div role="status" class="rounded-lg border bg-muted p-6 text-center">
			<p class="text-lg font-semibold">Thank you!</p>
			<p class="text-muted-foreground">
				We have received your enquiry and will reply by email soon.
			</p>
		</div>
	{:else}
		<form method="POST" action="/enquiry" {onsubmit} class="grid gap-4" novalidate={false}>
			{#if tourId}<input type="hidden" name="tour" value={tourId} />{/if}
			{#if tourTitle}
				<p class="text-sm text-muted-foreground">Enquiring about: <strong>{tourTitle}</strong></p>
			{/if}

			<div class="grid gap-1.5">
				<Label for="enq-name">Name</Label>
				<Input
					id="enq-name"
					name="name"
					required
					maxlength={120}
					autocomplete="name"
					aria-invalid={errors.name ? 'true' : undefined}
				/>
				{#if errors.name}<p class="text-sm text-destructive">{errors.name}</p>{/if}
			</div>

			<div class="grid gap-1.5">
				<Label for="enq-email">Email</Label>
				<Input
					id="enq-email"
					name="email"
					type="email"
					required
					maxlength={200}
					autocomplete="email"
					aria-invalid={errors.email ? 'true' : undefined}
				/>
				{#if errors.email}<p class="text-sm text-destructive">{errors.email}</p>{/if}
			</div>

			<div class="grid gap-4 sm:grid-cols-3">
				<div class="grid gap-1.5">
					<Label for="enq-phone">Phone (optional)</Label>
					<Input id="enq-phone" name="phone" type="tel" maxlength={40} autocomplete="tel" />
				</div>
				<div class="grid gap-1.5">
					<Label for="enq-travelers">Travelers</Label>
					<Input id="enq-travelers" name="travelers" type="number" min="1" max="99" />
				</div>
				<div class="grid gap-1.5">
					<Label for="enq-dates">Travel dates</Label>
					<Input id="enq-dates" name="travelDates" maxlength={120} placeholder="e.g. Aug 2026" />
				</div>
			</div>

			<div class="grid gap-1.5">
				<Label for="enq-message">Message</Label>
				<Textarea
					id="enq-message"
					name="message"
					rows={5}
					required
					maxlength={5000}
					aria-invalid={errors.message ? 'true' : undefined}
				/>
				{#if errors.message}<p class="text-sm text-destructive">{errors.message}</p>{/if}
			</div>

			<!-- Honeypot: hidden from people and assistive tech -->
			<div
				aria-hidden="true"
				style="position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden"
			>
				<label>Website <input type="text" name="website" tabindex="-1" autocomplete="off" /></label>
			</div>

			{#if formError || (status === 'idle' && failedViaRedirect)}
				<p role="alert" class="text-sm text-destructive">
					{formError || 'Please check your details and try again.'}
				</p>
			{/if}

			<Button type="submit" disabled={status === 'sending'}>
				{status === 'sending' ? 'Sending…' : 'Send enquiry'}
			</Button>
		</form>
	{/if}
</div>
