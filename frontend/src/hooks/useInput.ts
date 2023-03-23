import { ChangeEvent } from "react"
import useLocalStorage from "./useLocalStorage"

const useInput = (key: string, initValue: string | Function) => {
    const [value, setValue] = useLocalStorage(key, initValue)
    const reset = () => setValue(initValue)

    const attributeObj = {
        value,
        onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
    }

    return [value, reset, attributeObj]
}

export default useInput