import { DetailedHTMLProps, InputHTMLAttributes, RefObject } from "react"

interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  innerRef?: RefObject<HTMLInputElement>,
  label: string,
  marginTop?: number,
  marginBottom?: number,
}

const Checkbox = ({ innerRef, label, marginTop, marginBottom, ...rest }: Props) => {
  return (
    <div className="checkbox-div" style={{ marginTop, marginBottom }}>
      <input ref={innerRef} className="checkbox" id="checkbox" type="checkbox" {...rest} />
      <label htmlFor="checkbox">{label}</label>
    </div>
  )
}

export default Checkbox