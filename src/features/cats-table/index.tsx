import { serverAction } from "@/services/action";
import { RESOURCE_URL } from "@/services/fetch";
import { NextServerSearchParam } from "@/types";
import Image from "next/image";
const myBlurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

export const CatsTable = async ({ tags }: { tags?: NextServerSearchParam }) => {
    const tagFilter = Array.isArray(tags) ? tags.join(',') : tags
    const { data } = await serverAction['getCats']({ limit: 100, tags: tagFilter })
    return (
        <div className="grid grid-cols-4 gap-4">
            {data?.map((d) => {
                return (
                    <div className="col-span-1" key={d.id}>
                        <Image
                            src={`${RESOURCE_URL}/cat/${d.id}`}
                            alt={d.tags.join(',')}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover aspect-video"
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