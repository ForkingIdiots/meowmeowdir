'use client'
import { Button } from "@/components/Button"
import { useServerAction } from "@/services/useServerAction"

export const CatsTable = () => {

    const { fetch } = useServerAction('getCats')
    const handleClick = async () => {
        console.log('click')
        await fetch({})
    }
    return (
        <div className="">
            <Button onClick={() => handleClick()}> fetch </Button>
        </div>
    )
}