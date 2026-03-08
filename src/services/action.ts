import { paths } from "@/schema";
import { getCat, getCats } from "./loader";
import { FetchOptions, FetchResponse } from "openapi-fetch";

export const serverAction = {
    'getCat': getCat,
    'getCats': getCats
} as const
export type ServerAction = typeof serverAction
export type ServerActionName = keyof ServerAction