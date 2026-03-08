'use server'
import { serverAction } from "@/services/action"

export const CatsTable = async () => {

    const { data } = await serverAction['getCats']({ limit: 1000 })
    return (
        <div className="">
            {JSON.stringify(data)}
        </div>
    )
}