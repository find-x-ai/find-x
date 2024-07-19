import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { streamText } from 'hono/streaming';
import { Index } from '@upstash/vector';
import { Redis } from '@upstash/redis/cloudflare';
import { instructions } from '../extra/istructions';
import Groq from 'groq-sdk';
import { cache } from 'hono/cache';
import { splitText } from './methods/split';

const app = new Hono();

type EnvironmentVariables = {
	UPSTASH_VECTOR_REST_TOKEN: string;
	UPSTASH_VECTOR_REST_URL: string;
	AI_API_KEY: string;
	UPSTASH_REDIS_REST_URL: string;
	UPSTASH_REDIS_REST_TOKEN: string;
	UPSERT_SECRET_KEY: string;
};

type Chunk = {
	id: string;
	metadata: {
		client_id: string;
		url: string;
		content: string;
	};
	data: string;
};

type Context = {
	url: string;
	content: string;
};

type Data = {
	id: string;
	requests: number;
	name: string;
	remaining: number;
};

//allow cross origin requests
app.use(cors());

app.get('/', (c) => c.text('working fine...'));

//endpoint for query
app.post(
	'/query',
	async (c) => {
		const t0 = performance.now();
		const { UPSTASH_VECTOR_REST_TOKEN, UPSTASH_VECTOR_REST_URL, AI_API_KEY, UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } =
			c.env as EnvironmentVariables;

		const secret = c.req.header('Authorization') as string;

		if (!secret) {
			return c.json({ message: 'Missing authorization header' }, 401);
		}

		const key = secret.split('Bearer ')[1];

		const { query } = await c.req.json();

		if (!query) {
			return c.json({ message: 'Missing parameters' }, 400);
		}

		const redis = new Redis({
			url: UPSTASH_REDIS_REST_URL,
			token: UPSTASH_REDIS_REST_TOKEN,
		});
		const info = (await redis.get(key)) as Data;

		if (!info.id) {
			return c.json({ message: 'Invalid Authorization key' }, 400);
		}
		try {
			const groq = new Groq({ apiKey: AI_API_KEY });

			const index = new Index({
				url: UPSTASH_VECTOR_REST_URL,
				token: UPSTASH_VECTOR_REST_TOKEN,
				cache: false,
			});
			const namespace = index.namespace(info.id);

			const res = (await namespace.query({
				data: query,
				topK: 3,
				includeVectors: false,
				includeMetadata: true,
				includeData: true,
			})) as Chunk[];

			let array_of_context: Context[] = [];
			let ids = [];
			for (const chunk of res) {
				ids.push(chunk.id);
				array_of_context.push({
					url: chunk.metadata.url,
					content: chunk.data,
				});
			}
			const data = `
    <message>
      <query>${query}</query>
      <chunks>
        ${array_of_context
					.map(
						(context, index) => `
            <page>
                <url>${context.url}</url>
                <content>${context.content}</content>
            </page>`
					)
					.join('')}
       </chunks>
    </message>`;
			let end = '<#$#>';

			array_of_context.forEach((c, index) => {
				end += c.url + '#' + c.content + '<*$*>';
			});
			const t1 = performance.now();
			return streamText(c, async (stream) => {
				const chatCompletion = await groq.chat.completions.create({
					messages: [
						{
							role: 'system',
							content: instructions,
						},
						{
							role: 'user',
							content: data,
						},
					],
					model: 'llama3-70b-8192',
					stream: true,
				});
				let oneTime = 0;
				for await (const chunk of chatCompletion) {
					const content = chunk.choices[0].delta.content;
					if (content) {
						if (oneTime === 0) {
							redis
								.set(key, { ...info, requests: info.requests + 1, remaining: parseFloat((info.remaining - 0.02).toFixed(2)) })
								.then(() => {
									oneTime = 1;
								});
						}
						await stream.write(content);
					}
				}
				await stream.write(end);

				// const logs = (await redis.get('logs')) as [];
				// await redis.set('logs', [
				// 	...logs,
				// 	{
				// 		client: info.name,
				// 		status: 200,
				// 		time: performance.now(),
				// 	},
				// ]);

				await stream.close();
			});
		} catch (error) {
			const logs = (await redis.get('logs')) as [];
			await redis.set('logs', [
				...logs,
				{
					status: 500,
					client: info.name,
					time: Date.now(),
				},
			]);

			console.log(error);
			c.json({ success: false, answer: 'Something went wrong!!!' }, 500);
		}
	},
	cache({
		cacheName: 'fx',
		cacheControl: 'max-age=3600',
	})
);

app.post('/upsert', async (c) => {
	const token = c.req.header('Authorization') as string;

	const key = token.split('Bearer ')[1];

	if (!key || !token) {
		return c.json({ mssage: 'No authorization key provided' }, 400);
	}

	try {
		const { UPSTASH_VECTOR_REST_TOKEN, UPSTASH_VECTOR_REST_URL, UPSERT_SECRET_KEY } = c.env as EnvironmentVariables;

		if (key !== UPSERT_SECRET_KEY) {
			return c.json({ mssage: 'Invalid key provided' }, 400);
		}

		const { client, data } = (await c.req.json()) as { client: number; data: [{ url: string; content: string }] };

		if (!client || !data || data.length < 1) {
			return c.json({ message: 'Missing parameters' }, 400);
		}

		const index = new Index({
			url: UPSTASH_VECTOR_REST_URL,
			token: UPSTASH_VECTOR_REST_TOKEN,
			cache: false,
		});

		const namespace = index.namespace(client.toString());

		for (let chunk of data) {
			if (chunk.content.length > 2043) {
				const splitted_chunks = splitText(chunk.content);

				for (let i = 0; i < splitted_chunks.length; i++) {
					await namespace.upsert({
						id: `${chunk.url}_${i + 1}`,
						data: splitted_chunks[i],
						metadata: {
							client: client,
							url: chunk.url,
							content: splitted_chunks[i],
						},
					});
				}
			} else {
				await namespace.upsert({
					id: `${chunk.url}`,
					data: chunk.content,
					metadata: {
						client: client,
						url: chunk.url,
						content: chunk.content,
					},
				});
			}
		}
		return c.json({ message: 'successfully embedded the chunks' }, 200);
	} catch (error) {
		console.log(error);
		return c.json({ message: 'Something went wrong' }, 500);
	}
});

export default app;
