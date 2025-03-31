import { openai } from '@ai-sdk/openai';
import { CoreMessage } from 'ai';
import z from 'zod';

const meal = z.object({
	type: z.enum(['breakfast', 'lunch', 'supper', 'snack']).describe('The type for this meal'),
	name: z.string().describe('the name of the meal'),
	ingredients: z
		.array(
			z.object({
				item: z.string().describe('the ingredient name'),
				measure: z.string().describe('the measurement and unit of the ingredient'),
			})
		)
		.describe('the list of ingredients for this meal'),
	instructions: z.string().describe('the instructions for cooking the meal'),
	nutrition: z.object({
		calories: z.string(),
		protein: z.string().describe('the amount of protein for this meal in grams'),
		fat: z.string().describe('the amount of fat for this meal in grams'),
		carbs: z.string().describe('the amount of carbs for this meal in grams'),
	}),
});

const day = z.object({
	meals: z.array(meal),
});

const schema = z.object({
	days: z.array(day),
});

const model = openai('gpt-4o-2024-11-20');

const messages: CoreMessage[] | undefined = [
	{
		role: 'system',
		content: 'You create meal plans using the most accurate information possible',
	},
	{
		role: 'assistant',
		content: 'I will create meal plans based on your specifications for the amount of days you need',
	},
	{
		role: 'user',
		content:
			'I am a 33 year old man weighing 87kg and measuring 188cm in height. My maximum allowed calorie intake for one day is 1762. Generate 3 days of high protein meals for me.',
	},
];

export default {
	schema,
	model,
	messages,
	filename: 'meals',
};
