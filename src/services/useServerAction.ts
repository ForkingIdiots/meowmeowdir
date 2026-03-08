export const useServerAction = (actionName: string) => {
    const r = async (payload?: any) => await fetch(`/api/getServerAction?actionName=${actionName}`, {
        method: 'POST',
        body: JSON.stringify(payload ?? {})
    })
    return { fetch: r }
}