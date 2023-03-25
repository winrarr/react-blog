import { ChangeEvent, useState } from "react"

type attr = {
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
}

const useInput = (): [string, attr] => {
    const [value, setValue] = useState("")

    const attributeObj = {
        value,
        onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
    }

    return [value, attributeObj]
}

export default useInput