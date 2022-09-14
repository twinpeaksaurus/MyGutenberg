import { gql, useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'


const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
  `

const EDIT_AUTHOR = gql`
mutation changeAuthor(
  $name: String!
  $born: String!
) {
    editAuthor(name: $name, born: $born) {
      name
      id
      born
      bookCount
    }
  }

`

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const result = useQuery(ALL_AUTHORS)
  const [editAuthor] = useMutation(EDIT_AUTHOR)


  const submit = (event) => {
    event.preventDefault()

    console.log(name)
    console.log(born)

    editAuthor({ variables: { name, born } })

    //reset states to empty strings
    setBorn('')
    setName('')
  }
  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <div>
        <h2>Authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>Birth Year</th>
              <th>Books</th>
            </tr>
            {authors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Set Birth Year</h2>
      <form onSubmit={submit}>
        <div>
          Name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          Birth Year
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">Edit Author</button>

      </form>
    </div>
  )
}

export default Authors
