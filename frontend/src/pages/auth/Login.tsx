import Form from "../../components/auth-form/Form"

// Login form
const Login = () => {
  return (
    <Form route="/api/token/" method="login"/>
  )
}

export default Login