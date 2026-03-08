import { paths } from "@/schema";
import { getCat, getCats } from "./loader";
import { FetchOptions, FetchResponse } from "openapi-fetch";

export const serverAction: Record<string, any> = {
    'getCat': getCat,
    'getCats': getCats
} 