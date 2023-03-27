import { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string,
}

const FormField = ({ placeholder, ...props }: Props) => (
  <>
    <input className="form-field-input" required {...props} />
    <label className="form-field-label">{placeholder}</label>
  </>
)

export default FormField