const express = require("express")
const { v4: uuidV4 } = require('uuid')

const app = express()
const PORT = 3000

app.use(express.json())

const customers = []

app.post('/account', (request, response) => {
    const { cpf, name } = request.body
    
    const customerAlreadyExist = customers.some(customer => customer.cpf === cpf)

    if(customerAlreadyExist) return response.status(400).json({error: "Custumer already exist"})

    customers.push({
        cpf,
        name,
        id: uuidV4(),
        statement: []
    })

    return response.status(201).send()
})



app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})