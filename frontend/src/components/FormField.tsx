import { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string,
  marginBottom?: number,
}

const FormField = ({ placeholder, marginBottom = 0, ...rest }: Props) => {
  return (
    <div className="form-field" style={{ marginBottom: -16 + marginBottom }}>
      <input
        {...rest}
        placeholder=" "
      />
      <label>{placeholder}</label>
    </div>
  )
}

export default FormField