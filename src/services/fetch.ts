import createClient from "openapi-fetch";
import type { paths } from "../schema";
export const api = createClient<paths>({ baseUrl: 'https://cataas.com' })