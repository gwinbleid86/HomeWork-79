const express = require('express');
const cors = require('cors');
const subjects = require('./app/subjects');
const locations = require('./app/locations');
const categories = require('./app/categories');
const mysqlDB = require("./mysqlDB");


const app = express();
const port = 8000;


app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.use('/subjects', subjects);
app.use('/locations', locations);
app.use('/categories', categories);

const run = async () =>{
    await mysqlDB.connect();

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });

    process.on('exit', ()=>{
        mysqlDB.disconnect()
    });
};

run().catch(e=>{
    console.log(e);
});


