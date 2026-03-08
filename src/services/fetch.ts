import createClient from "openapi-fetch";
import type { paths } from "../schema";

export const RESOURCE_URL = 'https://cataas.com'

export const api = createClient<paths>({ baseUrl: RESOURCE_URL })