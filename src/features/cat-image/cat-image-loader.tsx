import { serverAction } from "@/services/action"

export const CatImageLoader = async ({ id }: { id: string }) => {

    const { data } = await serverAction['getCatById'](id)
    console.log(data)

    return (
        <div className="">image {id}</div>
    )
}