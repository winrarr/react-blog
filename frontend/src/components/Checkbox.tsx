import { DetailedHTMLProps, RefObject } from "react"

interface Props {
  innerRef?: RefObject<HTMLInputElement>,
  label: string,
}

const Checkbox = ({ innerRef, label }: Props) => {
  return (
    <div className="checkbox-div" >
      <input ref={innerRef} className="checkbox" id="checkbox" type="checkbox" />
      <label htmlFor="checkbox">{label}</label>
    </div>
  )
}

export default Checkbox