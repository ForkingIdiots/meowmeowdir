import { paths } from "@/schema"
import { api } from "./fetch"

export const getCat = async () => {
    return await api.GET('/cat')
}

type GetCatsParams = paths['/api/cats']['get']['parameters']['query']
export const getCats = async (query?: GetCatsParams) => {
    console.log('query', query)
    return await api.GET('/api/cats', { params: { query } })
}