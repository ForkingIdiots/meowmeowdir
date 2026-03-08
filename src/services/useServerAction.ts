import { ServerAction, ServerActionName } from "./action"

export const useServerAction = <K extends ServerActionName>(actionName: K) => {
    const r = async (payload?: Parameters<ServerAction[K]>[0]) => await fetch(`/api/getServerAction?actionName=${actionName}`, {
        method: 'POST',
        body: JSON.stringify(payload ?? {})
    })
    return { fetch: r }
}