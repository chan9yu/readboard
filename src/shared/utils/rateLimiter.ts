type RateLimiterConfig = {
	maxRequests: number;
	windowMs: number;
};

export function createRateLimiter({ maxRequests, windowMs }: RateLimiterConfig) {
	const timestamps: number[] = [];

	return {
		check() {
			const now = Date.now();
			const windowStart = now - windowMs;

			let first = timestamps[0];
			while (first !== undefined && first <= windowStart) {
				timestamps.shift();
				first = timestamps[0];
			}

			if (timestamps.length >= maxRequests) {
				const oldest = timestamps[0] ?? now;
				return { allowed: false, retryAfterMs: oldest + windowMs - now } as const;
			}

			timestamps.push(now);
			return { allowed: true } as const;
		}
	};
}
