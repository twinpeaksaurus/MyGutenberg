const { ApolloServer, UserInputError, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')


const MONGODB_URI = 'mongodb+srv://mongo460:Dryden460!@librarycatalog.y77yggq.mongodb.net/?retryWrites=true&w=majority'

console.log('connecting to ', MONGODB_URI)

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB successfully')
    })
    .catch((error) => {
        console.log('error with connection to MongoDB', error.message)
    })


const typeDefs = gql`

type Book {
    title: String!
    published: String!
    author: Author!
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
        bookCount: async () => Book.collection.countDocuments,
        authorCount: async () => Author.collection.countDocuments,
        allBooks: async (root, args) => {
            return Book.find({})
        },
        allAuthors: async (root, args) => {
            return Author.find({})
        },
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
        addBook: async (root, args) => {
            currentBooks = Book.find({})
            if (Book.collection.find((b) => b.title === args.name)) {
                throw new UserInputError('Title must be unique', {
                    invalidArgs: args.title
                })
            }


            let author = await Author.findOne({ name: args.author })
            if (!author) {
                author = new Author({ name: args.author, born: null, bookCount: 1 })
                author.save()
            }
            else {
                author.bookCount += 1
                await author.save()
            }
            const book = new Book({
                title: args.title,
                published: args.published,
                genres: args.genres,
                author: author

            })
            book.save()

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

