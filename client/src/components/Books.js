import { gql, useQuery } from '@apollo/client'

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {name}
      published
      genres
      description
    }
  }
  `

const Books = (props) => {

  const result = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>Books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Publication Year</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
