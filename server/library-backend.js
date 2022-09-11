const { ApolloServer, UserInputError, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')

let authors = [
    {
        name: 'Robert Martin',
        id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
        born: 1952,
    },
    {
        name: 'Martin Fowler',
        id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
        born: 1963
    },
    {
        name: 'Fyodor Dostoevsky',
        id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
        born: 1821
    },
    {
        name: 'Joshua Kerievsky', // birthyear not known
        id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    },
    {
        name: 'Sandi Metz', // birthyear not known
        id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
*/

let books = [
    {
        title: 'Clean Code',
        published: 2008,
        author: 'Robert Martin',
        id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring'],
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at sem auctor, aliquet libero vel, iaculis elit. Cras id purus non nibh egestas bibendum sed sed dui. Proin tempor tellus a massa aliquet congue. Integer nec ipsum ullamcorper, hendrerit nunc eget, egestas elit. Donec ac nibh at mauris mollis blandit auctor malesuada tortor. Aenean fermentum velit eu justo sollicitudin pulvinar. Ut purus augue, porta non orci ut, tempor feugiat massa. Aenean varius, diam id iaculis euismod, ex elit semper lacus, vitae semper odio dolor id nulla. Mauris viverra justo ac sapien mattis, in dictum dolor suscipit. Ut id cursus tellus. Vivamus aliquam massa vel tempor maximus. Duis vitae convallis urna."
    },
    {
        title: 'Agile software development',
        published: 2002,
        author: 'Robert Martin',
        id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
        genres: ['agile', 'patterns', 'design'],
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at sem auctor, aliquet libero vel, iaculis elit. Cras id purus non nibh egestas bibendum sed sed dui. Proin tempor tellus a massa aliquet congue. Integer nec ipsum ullamcorper, hendrerit nunc eget, egestas elit. Donec ac nibh at mauris mollis blandit auctor malesuada tortor. Aenean fermentum velit eu justo sollicitudin pulvinar. Ut purus augue, porta non orci ut, tempor feugiat massa. Aenean varius, diam id iaculis euismod, ex elit semper lacus, vitae semper odio dolor id nulla. Mauris viverra justo ac sapien mattis, in dictum dolor suscipit. Ut id cursus tellus. Vivamus aliquam massa vel tempor maximus. Duis vitae convallis urna."

    },
    {
        title: 'Refactoring, edition 2',
        published: 2018,
        author: 'Martin Fowler',
        id: "afa5de00-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring'],
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at sem auctor, aliquet libero vel, iaculis elit. Cras id purus non nibh egestas bibendum sed sed dui. Proin tempor tellus a massa aliquet congue. Integer nec ipsum ullamcorper, hendrerit nunc eget, egestas elit. Donec ac nibh at mauris mollis blandit auctor malesuada tortor. Aenean fermentum velit eu justo sollicitudin pulvinar. Ut purus augue, porta non orci ut, tempor feugiat massa. Aenean varius, diam id iaculis euismod, ex elit semper lacus, vitae semper odio dolor id nulla. Mauris viverra justo ac'

    },
    {
        title: 'Refactoring to patterns',
        published: 2008,
        author: 'Joshua Kerievsky',
        id: "afa5de01-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'patterns'],
        description: "This book introduces the theory and practice of pattern-directed refactorings: sequences of low-level refactorings that allow designers to safely move designs to, towards, or away from pattern implementations. Using code from real-world projects, Kerievsky documents the thinking and steps underlying over two dozen pattern-based design transformations. Along the way he offers insights into pattern differences and how to implement patterns in the simplest possible ways."

    },
    {
        title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
        published: 2012,
        author: 'Sandi Metz',
        id: "afa5de02-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'design'],
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at sem auctor, aliquet libero vel, iaculis elit. Cras id purus non nibh egestas bibendum sed sed dui. Proin tempor tellus a massa aliquet congue. Integer nec ipsum ullamcorper, hendrerit nunc eget, egestas elit. Donec ac nibh at mauris mollis blandit auctor malesuada tortor. Aenean fermentum velit eu justo sollicitudin pulvinar. Ut purus augue, porta non orci ut, tempor feugiat massa. Aenean varius, diam id iaculis euismod, ex elit semper lacus, vitae semper odio dolor id nulla. Mauris viverra justo ac'

    },
    {
        title: 'Crime and punishment',
        published: 1866,
        author: 'Fyodor Dostoevsky',
        id: "afa5de03-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'crime'],
        description: "Raskolnikov, a destitute and desperate former student, wanders through the slums of St Petersburg and commits a random murder without remorse or regret. He imagines himself to be a great man, a Napoleon: acting for a higher purpose beyond conventional moral law. But as he embarks on a dangerous game of cat and mouse with a suspicious police investigator, Raskolnikov is pursued by the growing voice of his conscience and finds the noose of his own guilt tightening around his neck. Only Sonya, a downtrodden sex worker, can offer the chance of redemption."

    },
    {
        title: 'The Demon ',
        published: 1872,
        author: 'Fyodor Dostoevsky',
        id: "afa5de04-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'revolution'],
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at sem auctor, aliquet libero vel, iaculis elit. Cras id purus non nibh egestas bibendum sed sed dui. Proin tempor tellus a massa aliquet congue. Integer nec ipsum ullamcorper, hendrerit nunc eget, egestas elit. Donec ac nibh at mauris mollis blandit auctor malesuada tortor. Aenean fermentum velit eu justo sollicitudin pulvinar. Ut purus augue, porta non orci ut, tempor feugiat massa. Aenean varius, diam id iaculis euismod, ex elit semper lacus, vitae semper odio dolor id nulla. Mauris viverra justo ac sapien mattis, in dictum dolor suscipit. Ut id cursus tellus. Vivamus aliquam massa vel tempor maximus. Duis vitae convallis urna."

    },
]

const typeDefs = gql`

type Book {
    title: String!
    published: String!
    author: String!
    id: ID!
    genres: [String!]!
    description: String!
}
type Author {
    name: String!
    id: ID!
    born: String
    bookCount: Int
}

type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
type Mutation {
    addBook(
        title: String!
        published: String!
        author: String!
        genres: [String!]!
        description: String!

    ): Book

    editAuthor( name: String!, born: String!): Author
}

`

const resolvers = {
    Query: {
        bookCount: () => books.length,
        authorCount: () => authors.length,
        allBooks: (root, args) => {
            if (args.author && args.genre) {
                const authoredBooks = books.filter(book =>
                    book.author === args.author)
                return authoredBooks.filter(book =>
                    book.genres.find(g => g === args.genre))
            }
            if (!args.author && !args.genre) {
                return books
            }
            if (args.genre && !args.author) {
                return books.filter(book =>
                    book.genres.find(g => g === args.genre))
            }
            if (args.author && !args.genre) {
                return books.filter(book =>
                    book.author === args.author)
            }

        },
        allAuthors: () => authors
    },
    Author: {
        name: (root) => {
            return root.name
        },
        bookCount: (root) => {
            return books.reduce((acc, curr) => {
                if (curr.author === root.name) {
                    acc++
                }
                return acc
            }, 0)

        }
    },

    Mutation: {
        addBook: (root, args) => {
            if (books.find((b) => b.title === args.name)) {
                throw new UserInputError('Title must be unique', {
                    invalidArgs: args.title
                })
            }

            const author = { name: args.author, born: null, bookCount: 1, id: uuid() }
            authors = authors.concat(author)

            const book = { ...args, id: uuid() }
            books = books.concat(book)
            return book
        },

        editAuthor: (root, args) => {
            const author = authors.find((a) => a.name === args.name)
            if (!author) {
                return null
            }

            const updatedAuthor = { ...author, born: args.born }
            authors = authors.map((a) => (a.name === args.name ? updatedAuthor : a))
            return updatedAuthor
        }
    }

}



const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})

