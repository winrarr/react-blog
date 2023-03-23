import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import useLocalStorage from "./useLocalStorage"

type attr = {
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
}

const useInput = (): [string, Dispatch<SetStateAction<string>>, attr] => {
    const [value, setValue] = useState("")
    const reset = () => setValue("")

    const attributeObj = {
        value,
        onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
    }

    return [value, reset, attributeObj]
}

export default useInput