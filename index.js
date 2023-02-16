const express = require('express')
const app = express()

const port = 8000

app.get('/', (req, res) => {
    res.send('nodemon aangepast,')
})
app.listen(port, ()=> {
    console.log('Shaking it up on ' + port)
    }

)