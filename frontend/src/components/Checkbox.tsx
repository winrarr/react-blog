import { InputHTMLAttributes } from "react"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string,
  marginTop?: number,
  marginBottom?: number,
}

const Checkbox = ({ label, marginTop, marginBottom, ...rest }: Props) => {
  return (
    <div className="checkbox-div" style={{ marginTop, marginBottom }}>
      <input className="checkbox" id="checkbox" type="checkbox" {...rest} />
      <label htmlFor="checkbox">{label}</label>
    </div>
  )
}

export default Checkbox