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


app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})