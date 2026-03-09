'use client'

import { Button } from "@/components/Button"
import { Tag } from "@/components/Tag"
import { StateParams } from "@/libs/nuqs"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"

type TagButton = {
    tag: string
}



export const TagButton = ({ tag }: TagButton) => {
    const [currentTag, setCurrentTag] = useQueryState(
        StateParams.tags,
        parseAsArrayOf(parseAsString).withOptions({ shallow: false }),
    )
    const isSelected = currentTag?.includes(tag) ?? false

    const handleClick = () => {
        setCurrentTag((prev) => {
            const next = new Set(prev ?? [])
            if (next.has(tag)) next.delete(tag)
            else next.add(tag)
            return next.size === 0 ? null : Array.from(next)

        })
    }
    return (
        <Button onClick={handleClick} style={{ padding: 0, height: 'auto', border: 'none' }}>
            <Tag
                color={isSelected ? 'lime' : undefined}
            >{tag}</Tag>
        </Button>
    )
}