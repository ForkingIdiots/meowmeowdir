import { ServerAction, ServerActionName } from "./action"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
export const useServerAction = <K extends ServerActionName>(actionName: K) => {
    const url = new URL('/api/getServerAction', baseUrl)
    url.searchParams.set('actionName', actionName)
    const r = async (payload?: Parameters<ServerAction[K]>[0]) => await fetch(url.toString(),
        {
            method: 'POST',
            body: JSON.stringify(payload ?? {})
        })
    return { fetch: r }
}