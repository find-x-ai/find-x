import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { streamText } from 'hono/streaming';
import { OpenAI } from 'openai';
import { Index } from '@upstash/vector';
import { instructions } from '../extra/istructions';

const app = new Hono();

type EnvironmentVariables = {
	UPSTASH_VECTOR_REST_TOKEN: string;
	UPSTASH_VECTOR_REST_URL: string;
	OPENAI_API_KEY: string;
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

//endpoint for query
app.post('/query', async (c) => {
	const { UPSTASH_VECTOR_REST_TOKEN, UPSTASH_VECTOR_REST_URL, OPENAI_API_KEY } = c.env as EnvironmentVariables;

	const { client, query } = await c.req.json();

    if(!client || !query){
		return c.json({message: "Missing parameters"}, 400);
	}
	const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

	const index = new Index({
		url: UPSTASH_VECTOR_REST_URL,
		token: UPSTASH_VECTOR_REST_TOKEN,
		cache: false,
	});

	const res = (await index.query({
		data: query,
		filter: `client = ${client}`,
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
        ${array_of_context.map((context, index) => `
            <page>
                <url>${context.url}</url>
                <content>${context.content}</content>
            </page>`).join('')}
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

		for await (const chunk of openaiStream) {
			const content = chunk.choices[0].delta.content;
			if (content) {
				await stream.write(content);
			}
		}
	});
});

export default app;
