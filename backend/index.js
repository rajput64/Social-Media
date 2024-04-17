const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const morgan = require('morgan');
const fs = require("fs");
require("dotenv").config();



const app = express();



//middleware
app.use(cors());
app.use(express.json({limit: "5mb"}));
app.use(express.urlencoded({extended:true}))


fs.readdirSync('./routes').map((r) => app.use('/api',require(`./routes/${r}`)))

//database
mongoose.connect(process.env.DATABASE).then(()=>console.log("Databse connected"))
.catch(err=>console.log("Error in DB ", err))



// app.use('/api',apiroute)
//app listen
const port = process.env.PORT || 8000;
app.listen(port,console.log(`our server us runnung at port ${port}`))