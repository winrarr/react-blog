import { ChangeEventHandler, useState } from "react"

type attr = {
    value: string,
    onChange: ChangeEventHandler<HTMLInputElement>,
}

const useInput = (): [string, attr] => {
    const [value, setValue] = useState("")

    const attributeObj: attr = {
        value,
        onChange: e => setValue(e.target.value)
    }

    return [value, attributeObj]
}

export default useInput