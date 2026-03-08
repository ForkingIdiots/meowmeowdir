'use server'
import { serverAction } from "@/services/action"
import { RESOURCE_URL } from "@/services/fetch"
import Image from "next/image"
const myBlurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

export const CatsTable = async () => {

    const { data } = await serverAction['getCats']({ limit: 100, })
    return (
        <div className="grid grid-rows-4 gap-4">
            {data?.map((d) => {
                return (
                    <div className="grid-cols-1" key={d.id}>
                        <Image
                            src={`${RESOURCE_URL}/cat/${d.id}`}
                            alt={d.tags.join(',')}
                            width={200}
                            height={200}
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL={myBlurDataURL}
                        />
                    </div>
                )
            })}
        </div>
    )
}