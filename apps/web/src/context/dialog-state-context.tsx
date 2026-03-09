import { createContext, type PropsWithChildren, useContext } from 'react'
import { dialogs_list } from '@/constants'
import { useDialogs } from '@/hooks/use-dialogs'

export type DialogType = (typeof dialogs_list)[number]

interface DialogStateContext {
	dialogs: ReturnType<typeof useDialogs<DialogType>>
}

export const dialogStateContext = createContext<DialogStateContext | null>(null)

export function DialogStateContextProvider({ children }: PropsWithChildren) {
	const initailState = Object.fromEntries(dialogs_list.map(d => [d, false])) as Record<DialogType, boolean>
	const dialogs = useDialogs(initailState)
	return <dialogStateContext.Provider value={{ dialogs }}>{children}</dialogStateContext.Provider>
}

export function useDialogState() {
	const ctx = useContext(dialogStateContext)
	if (!ctx) throw Error('useAppState must be used inside AppStateContextProvider')
	return ctx
}
