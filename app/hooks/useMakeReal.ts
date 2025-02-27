import { useEditor, useToasts } from '@tldraw/tldraw'
import { useCallback } from 'react'
import { makeReal } from '../lib/makeReal'
import { track } from '@vercel/analytics/react'

export function useMakeReal() {
	const editor = useEditor()
	const toast = useToasts()

	return useCallback(async () => {
		const input = document.getElementById('openai_key_risky_but_cool') as HTMLInputElement
		track('make_real', { timestamp: Date.now() })

		try {
			await makeReal(editor)
		} catch (e: any) {
			console.error(e)
			toast.addToast({
				icon: 'cross-2',
				title: 'Something went wrong',
				description: `${e.message.slice(0, 100)}`,
			})
		}
	}, [editor, toast])
}
