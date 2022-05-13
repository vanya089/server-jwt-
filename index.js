const express = require('express');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose')
const router = require('./router')


const app = express();


app.use(express.json())
app.use('/auth', router)




const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://root:root@cluster0.aacpm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);
        app.listen(PORT, () => console.log(`server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start()