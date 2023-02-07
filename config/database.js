const mongoose = require('mongoose')
const app = require('../src/app')
let PORT = process.env.PORT || 3000

mongoose
    .connect( process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    })
})