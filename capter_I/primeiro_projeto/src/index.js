const express = require("express")
const { v4: uuidV4 } = require('uuid')

const app = express()
const PORT = 3000

app.use(express.json())

const customers = []

//Middleware
const verifyIsUserExist = (request, response, next) => {
    const { cpf } = request.headers

    const customer = customers.find(customer => customer.cpf === cpf)

    if (!customer) {
        return response.status(400).json({ error: "Customer not found" })
    }
    request.customer = customer
    return next()
}

const getBalance = (statement) => {
    return statement.reduce((acc, opperation) => {
        if (opperation.type === 'credit') {
            return acc + opperation.amount
        } else {
            return acc - opperation.amount
        }
    }, 0)
}

app.post('/account', (request, response) => {
    const { cpf, name } = request.body

    const customerAlreadyExist = customers.some(customer => customer.cpf === cpf)

    if (customerAlreadyExist) return response.status(400).json({ error: "Custumer already exist" })

    customers.push({
        cpf,
        name,
        id: uuidV4(),
        statement: []
    })

    return response.status(201).send()
})

// app.use(verifyIsUserExist)
app.get('/statement', verifyIsUserExist, (request, response) => {
    const { customer } = request
    return response.json(customer.statement)
})
app.get('/statement/date', verifyIsUserExist, (request, response) => {
    const { date } = request.query
    const { customer } = request

    const formatDate = new Date(date + " 00:00")

    const statement = customer.statement.filter((statement) => statement.created_at.toDateString() === new Date(formatDate).toDateString())
    return response.json(statement)
})

app.post('/deposit', verifyIsUserExist, (request, response) => {
    const { description, amount } = request.body
    const { customer } = request

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation)

    return response.status(201).send()
})

app.post('/withdraw', verifyIsUserExist, (request, response) => {
    const { amount } = request.body
    const { customer } = request

    const balance = getBalance(customer.statement)

    if (balance < amount) {
        return response.status(400).json({ error: "Insufficient founds" })
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "withdraw"
    }

    customer.statement.push(statementOperation)

    return response.send()


})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})