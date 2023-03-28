import { useState } from "react"

type attr = {
    value: string,
    onChange: (e: { target: { value: string } }) => void,
}

const useInput = (): [string, attr] => {
    const [value, setValue] = useState("")

    const attributeObj: attr = {
        value,
        onChange: (e: { target: { value: string } }) => setValue(e.target.value)
    }

    return [value, attributeObj]
}

export default useInput