import { openai } from '@ai-sdk/openai';
import { CoreMessage } from 'ai';
import z from 'zod';

const movement = z.object({
	type: z.enum(['warmup', 'workout', 'cooldown']).describe('The type of workout.'),
	name: z.string().describe('The name of this particular movement.'),
	instructions: z.string().describe('The instructions for this particular movement.'),
	reps: z.number().describe('The number of times the workout is to be repeated. Also know as repetitions.'),
	sets: z.number().describe('The number of cycles or sets of repetitions.'),
});

const workout = z.object({
	name: z.string().describe('The name of this workout.'),
	movements: z.array(movement),
});

const schema = z.object({
	name: z.string().describe('The name of this workout plan.'),
	description: z.string().describe('The description explaining the point of this plan.'),
	workouts: z.array(
		z.object({
			day: z.number().describe('The day number in the series.'),
			workout,
		})
	),
});

const model = openai('gpt-4o');

const messages: CoreMessage[] | undefined = [
	{
		role: 'system',
		content: 'You create workout plans using the most accurate information possible.',
	},
	{
		role: 'assistant',
		content: 'I will create workout plans based on your specifications.',
	},
	{
		role: 'user',
		content:
			'I am a 30 year old man. I am 5 feet 7 inches tall. I weight 160 lbs. I tore my MCL 2 months ago and it is healing properly. However i also have a small tear on my meniscus and from my understanding this will not heal and remain torn. I am going back to the gym and got the OK from my healthcare professional to start training with weight again. I am looking to get a leg workout program that I can do to strengthen my legs so that i do not get injured again in the future.',
	},
];

export default {
	schema,
	model,
	messages,
	filename: 'workout-plan',
};
