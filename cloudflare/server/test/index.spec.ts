import { test, expect } from 'vitest';

test('Worker Test Route', async () => {
	const res = await fetch('https://server.find-x.workers.dev/');
	expect(res.status).toBe(200);
});

test('Query Endpoint', async (c) => {
	const res = await fetch('https://server.find-x.workers.dev/query', {
		method: 'POST',
		body: JSON.stringify({
			query: 'test?',
		}),
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer test`,
		},
	});
	expect(res.status).toBe(200);
});
