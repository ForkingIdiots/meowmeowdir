import { Flex } from "@/components/Flex"
import { Tag } from "@/components/Tag"
import { serverAction } from "@/services/action"
import { TagButton } from "./tag-button"

export const TagsDisplay = async () => {
    const { data } = await serverAction.getTags()
    if (!data)
        return null
    return (
        <div className="p-2 border rounded max-h-80 overflow-y-auto">
            <Flex gap={4} wrap >
                {data.map((d) => (
                    <TagButton key={d} tag={d} />
                ))}
            </Flex>
        </div>
    )
}