import { serverAction, ServerActionName } from "@/services/action"
import { NextRequest, NextResponse } from "next/server"
import { FetchResponse } from "openapi-fetch"
import type { paths } from "@/schema"

type ServerActionResponse = FetchResponse<paths, any, any>

export async function POST(request: NextRequest) {
    const searchParams = new URLSearchParams(request.nextUrl.searchParams)
    const actionName = searchParams.get('actionName') || ''

    try {
        const action = serverAction[actionName as ServerActionName] as (arg0: any) => Promise<ServerActionResponse>
        const response = await action(request.body)
        if (response.response.ok) {
            return NextResponse.json(response.data)
        }
    } catch (error) {
        return NextResponse.error()
    }
}