import type { RequestHandler } from './$types';
import { json, redirect } from '@sveltejs/kit';
import { createEnquiry } from '$lib/server/api';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(v: FormDataEntryValue | null | undefined, max: number): string {
	return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export const POST: RequestHandler = async ({ request, url }) => {
	const wantsJson =
		(request.headers.get('accept') ?? '').includes('application/json') ||
		(request.headers.get('content-type') ?? '').includes('application/json');

	let raw: Record<string, FormDataEntryValue | null | undefined> = {};
	try {
		if ((request.headers.get('content-type') ?? '').includes('application/json')) {
			raw = (await request.json()) as typeof raw;
		} else {
			raw = Object.fromEntries(await request.formData());
		}
	} catch {
		return json({ ok: false, errors: { form: 'Invalid request.' } }, { status: 400 });
	}

	const back = (() => {
		const r = request.headers.get('referer');
		try {
			const u = r ? new URL(r) : null;
			if (u && u.origin === url.origin) return u.pathname;
		} catch {
			/* ignore */
		}
		return '/contact';
	})();

	const success = () => (wantsJson ? json({ ok: true }) : redirect(303, `${back}?sent=1#enquiry`));

	// Honeypot: pretend success.
	if (str(raw.website, 200)) return success();

	const name = str(raw.name, 120);
	const email = str(raw.email, 200);
	const message = str(raw.message, 5000);
	const phone = str(raw.phone, 40);
	const travelDates = str(raw.travelDates, 120);
	const travelersNum = parseInt(str(raw.travelers, 4), 10);
	const tour = str(raw.tour, 64);

	const errors: Record<string, string> = {};
	if (!name) errors.name = 'Please enter your name.';
	if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';
	if (!message) errors.message = 'Please tell us a little about your trip.';

	if (Object.keys(errors).length) {
		if (wantsJson) return json({ ok: false, errors }, { status: 400 });
		redirect(303, `${back}?error=1#enquiry`);
	}

	try {
		await createEnquiry({
			name,
			email,
			message,
			...(phone && { phone }),
			...(travelDates && { travelDates }),
			...(Number.isFinite(travelersNum) && travelersNum > 0 && { travelers: travelersNum }),
			...(tour && { tour: /^\d+$/.test(tour) ? Number(tour) : tour }),
			website: ''
		} as Parameters<typeof createEnquiry>[0]);
	} catch {
		if (wantsJson)
			return json(
				{ ok: false, errors: { form: 'Sorry, something went wrong. Please try again.' } },
				{ status: 502 }
			);
		redirect(303, `${back}?error=1#enquiry`);
	}

	return success();
};
