import { useEffect, useState } from "react"

const getLocalValue = <T>(key: string, initValue: T): T => {
    // value already exists
    const value = localStorage.getItem(key)
    if (value) return JSON.parse(value) as T

    // return result of a function
    if (initValue instanceof Function) return initValue() as T

    return initValue
}

const useLocalStorage = <T>(key: string, initValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [value, setValue] = useState(() => {
        return getLocalValue(key, initValue)
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    return [value, setValue]
}

export default useLocalStorage