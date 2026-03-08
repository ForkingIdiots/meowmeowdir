import { getCat, getCatById, getCats } from "./loader";

export const serverAction = {
    'getCat': getCat,
    'getCats': getCats,
    'getCatById': getCatById
} as const
export type ServerAction = typeof serverAction
export type ServerActionName = keyof ServerAction