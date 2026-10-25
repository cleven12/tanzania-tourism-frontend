export { cn } from 'cn';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function formatPrice(amount: number | null | undefined, currency = 'USD'): string {
	if (amount == null) return '';
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
		maximumFractionDigits: 0
	}).format(amount);
}

export function formatDuration(days: number | null | undefined): string {
	if (!days) return '';
	return days === 1 ? '1 day' : `${days} days`;
}

export function titleCase(s: string | null | undefined): string {
	return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}
