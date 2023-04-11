import { useState } from "react"

const useToggle = (initialState: boolean): [boolean, () => void] => {
  const [state, setState] = useState(initialState)
  return [state, () => setState(prev => !prev)]
}

export default useToggle