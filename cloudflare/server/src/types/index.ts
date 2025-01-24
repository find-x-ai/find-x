export type EnvironmentVariables = {
	UPSTASH_REDIS_REST_URL: string;
	UPSTASH_REDIS_REST_TOKEN: string;
	UPSTASH_VECTOR_REST_TOKEN: string;
	UPSTASH_VECTOR_REST_URL: string;
	UPSERT_SECRET_KEY: string;
	NEON_KEY: string;
	AI_API_KEY_1: string;
	AI_API_KEY_2: string;
	AI_API_KEY_3: string;
	AI_API_KEY_4: string;
	AI_API_KEY_5: string;
	AI_API_KEY_6: string;
	AI_API_KEY_7: string;
	AI_API_KEY_8: string;
	AI_API_KEY_9: string;
	AI_API_KEY_10: string;
	AI_API_KEY_11: string;
	AI_API_KEY_12: string;
};

export type Chunk = {
	id: string;
	score: number;
	metadata: {
		title: string;
		client_id: string;
		url: string;
		content: string;
		images: string;
	};
	data: string;
};

export type Context = {
	title: string;
	url: string;
	content: string;
	images: {
		data: [
			{
				src: string;
				alt: string;
			}
		];
	};
};

export type Data = {
	id: number;
	created_at: Date;
	url: string;
	api_key: string;
	status: 'queued' | 'deploying' | 'failed' | 'success';
	name: string;
	last_deploy: Date;
	user_id: number;
	total_requests: string;
	email: string;
	plan_name: 'free' | 'pro' | 'enterprise';
};

export type Header = {
	sources: { title: string; content: string; url: string }[];
	images: {
		data: Image[];
	};
};

export type Image = {
	src: string;
	alt: string;
};
