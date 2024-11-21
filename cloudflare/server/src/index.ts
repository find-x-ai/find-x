import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { streamText } from 'hono/streaming';
import { Index } from '@upstash/vector';
import { Redis } from '@upstash/redis/cloudflare';
import { instructions } from '../extra/istructions';
import Groq from 'groq-sdk';
import { cache } from 'hono/cache';
import { neon } from '@neondatabase/serverless';
import { EnvironmentVariables, Header, Image, Chunk, Data } from './types';

const app = new Hono();
//allow cross origin requests
app.use(cors());

app.get('/', (c) => c.text('working fine...'));

app.get('/autocomplete', async (c) => {
	const input = c.req.query('input')?.toLowerCase();
	const secret = c.req.header('Authorization');
	if (!input) {
		return c.json({ message: 'working', suggestion: '' }, 200);
	}
	if (!secret) {
		return c.json({ message: 'Invalid authorization header' }, 401);
	}
	try {
		const api_key = secret.split('Bearer ')[1];
		const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } = c.env as EnvironmentVariables;
		const redis = new Redis({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN, cache: 'force-cache' });
		const keys = (await redis.keys(`*${input}*${api_key}`)) as string[];
		if (keys.length == 0) {
			return c.json({ message: 'working', suggestions: [] }, 200);
		}
		const filtered_suggestions = keys.map((key) => key.split(api_key)[0]);
		console.log(filtered_suggestions);
		return c.json({ message: 'working', suggestions: filtered_suggestions }, 200);
	} catch (error) {
		console.log(error);
		return c.json({ message: 'something went wrong!', suggestions: [] }, 500);
	}
});

//endpoint for query
app.post(
	'/query',
	async (c) => {
		const env = c.env as EnvironmentVariables;

		const apiKeys: (keyof EnvironmentVariables)[] = [
			'AI_API_KEY_1',
			'AI_API_KEY_2',
			'AI_API_KEY_3',
			'AI_API_KEY_4',
			'AI_API_KEY_5',
			'AI_API_KEY_6',
			'AI_API_KEY_7',
			'AI_API_KEY_8',
			'AI_API_KEY_9',
			'AI_API_KEY_10',
			'AI_API_KEY_11',
			'AI_API_KEY_12',
		];

		// const selectedApiKey = env[apiKeys[randomIndex - 1]];
		const secret = c.req.header('Authorization') as string;

		if (!secret) {
			return c.json({ message: 'Missing authorization header' }, 401);
		}

		const { UPSTASH_VECTOR_REST_TOKEN, UPSTASH_VECTOR_REST_URL, NEON_KEY, UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } = env;

		const key = secret.split('Bearer ')[1];

		const { query } = await c.req.json();

		if (!query) {
			return c.json({ message: 'Missing parameters' }, 400);
		}

		const db = neon(NEON_KEY);

		const db_res = (await db('SELECT * FROM clients WHERE api_key = $1', [key])) as Data[];

		if (db_res.length < 1) {
			return c.json({ message: 'Invalid Authorization key' }, 400);
		}
		const id = db_res[0].id;
		const redis = new Redis({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN, cache: 'force-cache' });
		const cached_response = (await redis.get(query.trim().toLowerCase() + key)) as { header: string; response: string };
		let header: Header = { sources: [], images: { data: [] } };

		if (cached_response) {
			return streamText(c, async (stream) => {
				await stream.write(cached_response.header + '<#$#>' + cached_response.response);
				await db(`UPDATE clients SET total_requests = $1 WHERE id = $2`, [parseInt(db_res[0].total_requests) + 1, db_res[0].id]);
				await db('INSERT INTO logs (name , status) VALUES ($1, $2)', [db_res[0].name, 200]);
				await stream.close();
			});
		}

		try {
			const groq = new Groq({ apiKey: env[apiKeys[9]] });

			const index = new Index({
				url: UPSTASH_VECTOR_REST_URL,
				token: UPSTASH_VECTOR_REST_TOKEN,
				cache: false,
			});
			const namespace = index.namespace(id.toString());

			const res = (await namespace.query({
				data: query.toLowerCase(),
				topK: 3,
				includeVectors: false,
				includeMetadata: true,
				includeData: true,
			})) as Chunk[];
			let concatenatedHeader = '';
			let context: String[] = [];

			//Extract the data from the response chunks
			for (const chunk of res) {
				header.sources.push({
					title: chunk.metadata.title,
					content: chunk.data.length < 70 ? chunk.data : chunk.data.slice(0, 70) + '...',
					url: chunk.metadata.url,
				});
				context.push(chunk.data);
				const images = JSON.parse(chunk.metadata.images) as { data: Image[] };
				header.images.data = [...header.images.data, ...images.data];
			}
			// data for AI model
			const data = JSON.stringify({
				query: query,
				search_data: context,
			});

			// Convert the header object to a JSON string and concatenate with the special symbol
			concatenatedHeader += JSON.stringify(header) + '<#$#>';

			return streamText(c, async (stream) => {
				await stream.write(concatenatedHeader);
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
					model: 'llama-3.1-8b-instant',
					stream: true,
					temperature: 0.5,
				});
				let oneTime = 0;
				let full_content = '';
				for await (const chunk of chatCompletion) {
					const content = chunk.choices[0].delta.content;
					if (content) {
						if (oneTime === 0) {
							await db(`UPDATE clients SET total_requests = $1 , remaining = $2 WHERE id = $3`, [
								parseInt(db_res[0].total_requests) + 1,
								(db_res[0].remaining - 0.02).toFixed(2),
								db_res[0].id,
							]);

							await db('INSERT INTO logs (name , status) VALUES ($1, $2)', [db_res[0].name, 200]);
							oneTime = 1;
						}
						full_content += content;
						await stream.write(content);
					}
				}
				await redis.set(
					query.toLowerCase() + key,
					{
						header: JSON.stringify(header),
						response: full_content,
					},
					{ ex: 60 * 720 }
				);
				await stream.close();
			});
		} catch (error) {
			await db('INSERT INTO logs (name , status) VALUES ($1, $2)', [db_res[0].name, 500]);

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
		console.log('No authorization key provided');
		return c.json({ mssage: 'No authorization key provided' }, 400);
	}

	try {
		const { UPSTASH_VECTOR_REST_TOKEN, UPSTASH_VECTOR_REST_URL, UPSERT_SECRET_KEY } = c.env as EnvironmentVariables;

		if (key !== UPSERT_SECRET_KEY) {
			console.log('Invalid key provided');
			return c.json({ mssage: 'Invalid key provided' }, 400);
		}

		const { client, data } = (await c.req.json()) as {
			client: number;
			data: [
				{
					url: string;
					title: string;
					content: string;
					images: {
						data: [
							{
								src: string;
								alt: string;
							}
						];
					};
				}
			];
		};

		if (!client || !data || data.length < 1) {
			console.log('Missing parameters,', client, data);
			return c.json({ message: 'Missing parameters' }, 400);
		}

		const index = new Index({
			url: UPSTASH_VECTOR_REST_URL,
			token: UPSTASH_VECTOR_REST_TOKEN,
			cache: false,
		});

		const namespace = index.namespace(client.toString());

		for (let chunk of data) {
			if (chunk.content.trim().length > 50) {
				await namespace.upsert({
					id: `${chunk.url}`,
					data: chunk.content,
					metadata: {
						title: chunk.title,
						client: client,
						url: chunk.url,
						images: JSON.stringify(chunk.images),
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
