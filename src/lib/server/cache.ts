interface Entry<T> {
	value: T;
	expires: number;
}

/** Tiny in-memory TTL cache. Errors are never cached; stale values are served if a refresh fails. */
export class TtlCache {
	#store = new Map<string, Entry<unknown>>();
	#inflight = new Map<string, Promise<unknown>>();
	constructor(private now: () => number = Date.now) {}

	async get<T>(key: string, ttlSeconds: number, loader: () => Promise<T>): Promise<T> {
		const hit = this.#store.get(key) as Entry<T> | undefined;
		if (hit && hit.expires > this.now()) return hit.value;

		const pending = this.#inflight.get(key) as Promise<T> | undefined;
		if (pending) return pending;

		const p = loader()
			.then((value) => {
				this.#store.set(key, { value, expires: this.now() + ttlSeconds * 1000 });
				return value;
			})
			.catch((err) => {
				if (hit) return hit.value; // stale-safe
				throw err;
			})
			.finally(() => this.#inflight.delete(key));
		this.#inflight.set(key, p);
		return p;
	}

	clear() {
		this.#store.clear();
		this.#inflight.clear();
	}
}

export const cache = new TtlCache();
