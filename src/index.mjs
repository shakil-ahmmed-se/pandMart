import express from "express";

const PORT = process.env.PORT || 3000;

const mockUsers = [
    { id: 1, username: "johndee", displayName: "John Doe" },
    { id: 2, username: "karim", displayName: "Karim Islam" },
    { id: 3, username: "william", displayName: "William Jonson" },

]

const app = express();

app.get('/api/users', (req, res, next) => {
    res.send(mockUsers)
})

app.get('/api/products', (req, res, next) => {
    res.send([
        { id: 1, name: "Product 1", price: 100 },
        { id: 2, name: "Product 2", price: 200 },
        { id: 3, name: "Product 3", price: 300 },
    ])
})

app.get('/api/users/:id', (req, res, next) => {
    console.log(req.params);
    const parseId = parseInt(req.params.id);
    console.log(parseId)
    if (isNaN(parseId))
        return res.status(400).send({ msg: 'Bad Request. Invalid Id' })
    const findUser = mockUsers.find(user => user.id === parseId);
    if (!findUser)
        return res.status(404).send({ msg: 'User not found' })
    return res.send(findUser)

})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})