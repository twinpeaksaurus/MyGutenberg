import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { ALL_BOOKS } from './Books'

const CREATE_BOOK = gql`
mutation createBook(
  $title: String!
  $published: String!
  $author: String!
  $genres: [String!]!
  $description: String!
) {
  addBook(title: $title, published: $published, author: $author, 
    genres: $genres, description: $description) {
      title
      published
      author
      id
      genres
      description
    }
}
`

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [description, setDescription] = useState('')

  const [createBook] = useMutation(CREATE_BOOK)

 //{refetchQueries: [{ query: ALL_BOOKS }],}

  if (!props.show) {
    return null
  }

  const submit = (event) => {
    event.preventDefault()

    console.log(title)
    console.log(author)
    console.log(published)
    console.log(genres)
    console.log(description)


    console.log('add book...')

    createBook({ variables: { title, author, published, genres, description } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
    setDescription('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          Title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          Publication Year
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          Description
          <input
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            Add Genre
          </button>
        </div>
        <div>Genres (add one and click Add Genre): {genres.join(' ')}</div>
        <button type="submit">Create Book</button>
      </form>
    </div>
  )
}

export default NewBook
