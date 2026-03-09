import { paths } from "@/schema"
import { api } from "./fetch"

export const getCat = async () => {
    return await api.GET('/cat')
}

type GetCatsParams = paths['/api/cats']['get']['parameters']['query']
export const getCats = async (query?: GetCatsParams) => {
    return await api.GET('/api/cats', { params: { query } })
}

export const getCatById = async (id: string) => {
    return await api.GET('/cat/{id}', { params: { path: { id } } })
}

export const getTags = async () => {
    return await api.GET('/api/tags')
}