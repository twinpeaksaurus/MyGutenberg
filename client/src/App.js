import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { gql, useApolloClient, useQuery } from '@apollo/client'


const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [isAuthenticated, setAuthenticated] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const token = localStorage.getItem("library-user-token");
    if (token) {
      setAuthenticated(true);
    } else if (token === null) {
      setAuthenticated(false);
    }

    return () => { };
  }, []);


  //sets token to null, removes it from local storage (see login)
  //and resets the cache with resetStore()
  const logout = async () => {
    setToken(null)
    localStorage.clear()
    await client.resetStore()
    window.location.reload()
  }

  // if (!isAuthenticated) {
  //   return (
  //     <>
  //       <LoginForm setToken={setToken} />
  //     </>
  //   )
  // }

  //how to make it so when token is not present, log in is presented, 
  //but otherwise the logout button is present?
  return (
    <div>

      <button onClick={() => setPage('authors')}>Authors</button>
      <button onClick={() => setPage('books')}>Library</button>
      {isAuthenticated &&
        <>
          <button onClick={() => setPage('add')}>Add Title</button>
          <button onClick={logout}>Log Out </button>
        </>}
      {!isAuthenticated &&
        <button onClick={() => setPage('login')}>Log In</button>
      }

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      {/*Login form will take setToken*/}
      {
        !isAuthenticated &&
        <LoginForm setToken={setToken} show={page === 'login'} />
      }
    </div >
  )
}

export default App
