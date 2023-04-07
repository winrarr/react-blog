import { Field, Form, Formik } from "formik"
import { FormEventHandler } from "react"
import { object, string, number, date, InferType } from 'yup'

const userSchema = object({
  username: string()
    .required("Required")
    .min(3, "Too short")
    .max(16, "Too long"),
  password: string()
    .required("Required")
    .min(6, "Too short")
    .max(50, "Too long"),
})

type schema = InferType<typeof userSchema>

const LoginPage = () => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    data.forEach((value, key) => console.log(key + ": " + value.valueOf()))
  }

  return (
    <Formik<schema>
      initialValues={{
        username: "",
        password: "",
      }}
      validationSchema={userSchema}
      onSubmit={values => console.log(values)}
    >
      {({ errors, touched }) => (
        <Form className="auth-container">
          <Field name="username" />
          <div className="error-div">{touched.username && errors.username}</div>

          <Field name="password" type="password" />
          <div className="error-div">{touched.password && errors.password}</div>

          <input type="submit" value="Submit" />
        </Form>
      )}
    </Formik>
  )
}

export default LoginPage