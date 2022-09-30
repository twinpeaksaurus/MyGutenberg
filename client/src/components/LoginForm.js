import { useState, useEffect } from "react"
import { gql, useMutation } from "@apollo/client"
import { render } from "react-dom"

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

const LoginForm = ({ show, setToken }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [login, result] = useMutation(LOGIN, {
        //  onError: (error) => {
        //      setError(error.graphQLErrors[0].message)
        //  }
    })

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('library-user-token', token)
        }
    }, [result.data])

    if (!show) {
        return null
    }

    const submit = async (event) => {
        event.preventDefault()
        console.log(username)
        console.log(password)
        await login({ variables: { username, password } })
        //console.log(result.data.login.value)
        window.location.reload()
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    username <input
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password <input
                        type='password'
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type='submit'>login</button>
            </form>
        </div>
    )
}

export default LoginForm





