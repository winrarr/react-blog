import { useEffect, useState } from "react"

const getLocalValue = (key: string, initValue: string | Function) => {
    // SSR
    if (typeof window === 'undefined') return initValue

    // value already exists
    const value = localStorage.getItem(key)
    if (value) return JSON.parse(value)

    // return result of a function
    if (initValue instanceof Function) return initValue()

    return initValue
}

const useLocalStorage = (key: string, initValue: string | Function) => {
    const [value, setValue] = useState(() => {
        return getLocalValue(key, initValue)
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    return [value, setValue]
}

export default useLocalStorage