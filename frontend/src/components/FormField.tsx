import { DetailedHTMLProps, InputHTMLAttributes, RefObject } from 'react'

interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  innerRef?: RefObject<HTMLInputElement>,
  placeholder: string,
  marginBottom?: number,
}

const FormField = ({ innerRef, placeholder, marginBottom = 0, ...rest }: Props) => {
  return (
    <div className="form-field" style={{ marginBottom: -16 + marginBottom }}>
      <input
        ref={innerRef}
        {...rest}
        placeholder=" "
      />
      <label>{placeholder}</label>
    </div>
  )
}

export default FormField