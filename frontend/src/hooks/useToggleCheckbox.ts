import { ChangeEventHandler } from "react"
import useToggle from "./useToggle"

type attr = {
  state: boolean,
  onChange: ChangeEventHandler<HTMLInputElement>,
}

const useToggleCheckbox = (initialState: boolean): [boolean, attr] => {
  const [state, toggleState] = useToggle(initialState)

  const attributeObj: attr = {
    state,
    onChange: toggleState,
  }

  return [state, attributeObj]
}

export default useToggleCheckbox