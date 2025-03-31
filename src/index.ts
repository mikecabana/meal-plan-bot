import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { config } from 'dotenv';
import meals from './lib/meals';
import workouts from './lib/workouts';
import fs from 'fs';

config();

// const { model, schema, messages, filename } = meals;
const { model, schema, messages, filename } = workouts;

async function run() {
	const { object, partialObjectStream } = await streamObject({
		model,
		schema,
		messages
	});

	for await (const token of partialObjectStream) {
		console.clear();
		console.dir(token, { depth: null });
	}

	const data = await object;

	fs.writeFileSync(`${filename}.json`, JSON.stringify(data, null, 2));

	console.log('done!');
}

run();
