'use client'
import { useServerAction } from "@/services/useServerAction"
import { useEffect, useState } from "react"

export const CatImageLoader = async ({ id }: { id: string }) => {
    const [blob, setBlob] = useState<Blob | null>(null)
    const { fetch } = useServerAction('getCatById')

    useEffect(() => {
        const getImage = async () => {
            const response = await fetch(id)
            if (response.ok) {
                setBlob(await response.blob())
            }
        }
        getImage()
    }, [])
    if (!blob) return 'no image'
    return (
        null
    )
}