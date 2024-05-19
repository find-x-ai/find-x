import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { streamText } from 'hono/streaming';
import { OpenAI } from 'openai';
import { Index } from '@upstash/vector';
import { Redis } from '@upstash/redis/cloudflare';
import { instructions } from '../extra/istructions';

const app = new Hono();

type EnvironmentVariables = {
	UPSTASH_VECTOR_REST_TOKEN: string;
	UPSTASH_VECTOR_REST_URL: string;
	OPENAI_API_KEY: string;
	UPSTASH_REDIS_REST_URL: string;
	UPSTASH_REDIS_REST_TOKEN: string;
};

type Chunk = {
	metadata: {
		client_id: string;
		url: string;
		content: string;
	};
};

type Context = {
	url: string;
	content: string;
};

//allow cross origin requests
app.use(cors());

app.get('/', (c) => c.text('working fine...'));

//endpoint for query
app.post('/query', async (c) => {
	const t0 = performance.now();
	const { UPSTASH_VECTOR_REST_TOKEN, UPSTASH_VECTOR_REST_URL, OPENAI_API_KEY, UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } =
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

	const pipeline = redis.pipeline();

	pipeline.get(key); //0
	pipeline.get('logs'); //1
	pipeline.get('average'); //2

	const result = (await pipeline.exec()) as [{ id: number; remaining: number; name: string }, [], { average: number; total: number }];

	if (!result[0].id) {
		return c.json({ message: 'Invalid Authorization key' }, 400);
	}
	try {
		const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

		const index = new Index({
			url: UPSTASH_VECTOR_REST_URL,
			token: UPSTASH_VECTOR_REST_TOKEN,
			cache: false,
		});

		const res = (await index.query({
			data: query,
			filter: `client = ${result[0].id}`,
			topK: 5,
			includeVectors: false,
			includeMetadata: true,
		})) as Chunk[];

		let array_of_context: Context[] = [];

		for (const chunk of res) {
			array_of_context.push({
				url: chunk.metadata.url,
				content: chunk.metadata.content,
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

		return streamText(c, async (stream) => {
			const openaiStream = await openai.chat.completions.create({
				model: 'gpt-3.5-turbo',
				messages: [
					{ role: 'system', content: instructions },
					{ role: 'user', content: data },
				],
				stream: true,
			});

			pipeline.set(key, { ...result[0], remaining: parseFloat((result[0].remaining - 0.02).toFixed(3)) });
			pipeline.set('logs', [
				...result[1],
				{
					status: 200,
					client: result[0].name,
					time: Date.now(),
				},
			]);

			const t1 = performance.now();
			
			pipeline.set('average', {
				...result[2],
				average: (result[2].average + (t1 - t0)) / (result[2].total + 1),
				total: result[2].total + 1,
			});

			

			for await (const chunk of openaiStream) {
				const content = chunk.choices[0].delta.content;
				if (content) {
					await stream.write(content);
				}else{
					await pipeline.exec();
				}
			}
            

		});
	} catch (error) {
		pipeline.set('logs', [
			...result[1],
			{
				status: 500,
				client: result[0].name,
				time: Date.now(),
			},
		]);

		await pipeline.exec();
	}
});

app.post('/upsert', async (c) => {
	const { UPSTASH_VECTOR_REST_TOKEN, UPSTASH_VECTOR_REST_URL } = c.env as EnvironmentVariables;

	const { client, data } = (await c.req.json()) as { client: string; data: [{ url: string; content: string }] };

	if (!client || !data || data.length < 1) {
		return c.json({ message: 'Missing parameters' }, 400);
	}

	const index = new Index({
		url: UPSTASH_VECTOR_REST_URL,
		token: UPSTASH_VECTOR_REST_TOKEN,
		cache: false,
	});

	for (let chunk of data) {
		await index.upsert({
			id: `${client}_${chunk.url}`,
			data: chunk.content,
			metadata: {
				client: client,
				url: chunk.url,
				content: chunk.content,
			},
		});
	}

	return c.json({ message: 'successfully embedded the chunks' }, 200);
});

export default app;
