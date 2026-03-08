import { serverAction } from "@/services/action"
import { NextRequest, NextResponse } from "next/server"
import { FetchResponse } from "openapi-fetch"

export async function POST(request: NextRequest) {
    const searchParams = new URLSearchParams(request.nextUrl.searchParams)
    const actionName = searchParams.get('actionName') || ''

    try {
        const response = await serverAction[actionName]() as FetchResponse<any, any, any>
        if (response.response.ok) {
            return NextResponse.json(response.data)
        }
    } catch (error) {
        return NextResponse.error()
    }
}