const systemPrompt = `You are an expert front-end web developer specializing in React and TailwindCSS.
A user will provide you with a low-fidelity wireframe of an application.
Your task is to return a JSX file that uses React components styled with TailwindCSS to create a high-fidelity interface.
Include any necessary dependencies and ensure the code is ready to be integrated into a React project.
The final output should be a single JSX file with appropriate imports and React component structure.
If you need to use images, load them from a reliable source or use placeholders.
Translate any user-provided notes, arrows, or drawings into appropriate UI elements and styles.`

export const maxDuration = 60

export async function POST(request: Request) {
	const apiKey = process.env.OPENAI_API_KEY
	const { image, html } = await request.json()
	const body: GPT4VCompletionRequest = {
		model: 'gpt-4-vision-preview',
		max_tokens: 4096,
		temperature: 0,
		messages: [
			{
				role: 'system',
				content: systemPrompt,
			},
			{
				role: 'user',
				content: [
					{
						type: 'image_url',
						image_url: {
							url: image,
							detail: 'high',
						},
					},
					{
						type: 'text',
						text: 'Turn this into a single html file using tailwind.',
					},
					{
						type: 'text',
						text: html,
					},
				],
			},
		],
	}

	let json = null
	try {
		const resp = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify(body),
		})
		json = await resp.json()
	} catch (e) {
		console.log(e)
	}

	return new Response(JSON.stringify(json), {
		headers: {
			'content-type': 'application/json; charset=UTF-8',
		},
	})
}

type MessageContent =
	| string
	| (
			| string
			| {
					type: 'image_url'
					image_url:
						| string
						| {
								url: string
								detail: 'low' | 'high' | 'auto'
						  }
			  }
			| {
					type: 'text'
					text: string
			  }
	  )[]

export type GPT4VCompletionRequest = {
	model: 'gpt-4-vision-preview'
	messages: {
		role: 'system' | 'user' | 'assistant' | 'function'
		content: MessageContent
		name?: string | undefined
	}[]
	functions?: any[] | undefined
	function_call?: any | undefined
	stream?: boolean | undefined
	temperature?: number | undefined
	top_p?: number | undefined
	max_tokens?: number | undefined
	n?: number | undefined
	best_of?: number | undefined
	frequency_penalty?: number | undefined
	presence_penalty?: number | undefined
	logit_bias?:
		| {
				[x: string]: number
		  }
		| undefined
	stop?: (string[] | string) | undefined
}
