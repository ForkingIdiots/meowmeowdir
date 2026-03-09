import { getCat, getCatById, getCats, getTags } from "./loader";

export const serverAction = {
    'getCat': getCat,
    'getCats': getCats,
    'getCatById': getCatById,
    'getTags': getTags
} as const
export type ServerAction = typeof serverAction
export type ServerActionName = keyof ServerAction