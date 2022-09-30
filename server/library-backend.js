const { ApolloServer, UserInputError, gql, AuthenticationError } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const jwt = require('jsonwebtoken')
const User = require('./models/User')



const JWT_SECRET = '9345y8348gth8gt35478y34wiufrbhweu9igrt'

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

type User {
    username: String!
    favoriteGenre: String!
    id: ID!
}

type Token {
    value: String!
}

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
    me: User
  }

type Mutation {
    addBook(
        title: String!
        published: String!
        author: String!
        genres: [String!]!
        description: String!

    ): Book!

    editAuthor( name: String!, 
        born: String!
    ): Author

    createUser(
        username: String!
        favoriteGenre: String!
    ): User

    login(
        username: String!
        password: String!
    ): Token
}

`

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments,
        authorCount: async () => Author.collection.countDocuments,
        allBooks: async (root, args) => {
            if (args.genre) {
                return Book.find({ genres: { $in: [args.genre] } })
                    .populate('author')
            }
            return Book.find({}).populate('author')
        },
        allAuthors: async (root, args) => {
            return Author.find({})
        },
        me: (root, args, context) => {
            return context.currentUser

        }
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
        addBook: async (root, args, context) => {

            let author = await Author.findOne({ name: args.author })
            const currentUser = context.currentUser
            if (!currentUser) {
                throw new AuthenticationError("not authenticated")
            }

            if (!author) {
                author = new Author({ name: args.author })
                try {
                    await author.save()
                } catch (error) {
                    throw new UserInputError(error.message, {
                        invalidArgs: args,
                    })
                }
            } else {
                await author.save()
            }

            let book = new Book({
                title: args.title,
                published: args.published,
                genres: args.genres,
                author: author,
                description: args.description
            })

            try {
                await (await book.save()).populate('author')
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }
            return book
        },

        //Why does the mutation not return anything when tested
        //in Apollo Server?
        editAuthor: async (root, args) => {

            const author = await Author.findOne({ name: args.name })
            author.born = args.born

            const currentUser = context.currentUser

            if(!currentUser) {
                throw new AuthenticationError("not authenticated")
            }

            if(!author) {
                return null
            }

            try {
                await author.save()
            }
            catch {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }
            // const author = authors.find((a) => a.name === args.name)
            // if (!author) {
            //     return null
            // }

            // const updatedAuthor = { ...author, born: args.born }
            // authors = authors.map((a) => (a.name === args.name ? updatedAuthor : a))
            // return updatedAuthor
        },
        createUser: async (root, args) => {
            const user = new User({
                username: args.username,
                favoriteGenre: args.favoriteGenre
            })

            return user.save()
                .catch(error => {
                    throw new UserInputError(error.message,
                        { invalidArgs: args, })
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })
            //for the sake of testing basic authorization, all passwords are 'secret'
            if (!user || args.password !== 'secret') {
                throw new UserInputError("wrong credentials")
            }
            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, JWT_SECRET) }
        }
    }

}




const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            const decodedToken = jwt.verify(
                auth.substring(7), JWT_SECRET
            )
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
        }
    }
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})

