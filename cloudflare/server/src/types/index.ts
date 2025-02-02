export type EnvironmentVariables = {
	UPSTASH_REDIS_REST_URL: string;
	UPSTASH_REDIS_REST_TOKEN: string;
	UPSTASH_VECTOR_REST_TOKEN: string;
	UPSTASH_VECTOR_REST_URL: string;
	UPSERT_SECRET_KEY: string;
	NEON_KEY: string;
	GROQ_API_KEY: string;
	TOGETHER_AI_API_KEY: string;
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
	log_count: string;
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
