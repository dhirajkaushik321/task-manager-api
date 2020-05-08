// Loading npm modules and built-in node modules
const express=require('express');
//Loading mongoose.js module
require('./db/mongoose')
//Loading user model
const User=require('./models/user')
// Loading task model
const Task=require('./models/task')
// Loading user router
const userRouter=require('./routers/user')
// Loading task router
const taskRouter=require('./routers/task')
//Creating app using express()
const app=express()
//using express json() method to automatically parse incoming json data into js object
app.use(express.json())
// using app.use to use the user and task router
app.use(userRouter)
app.use(taskRouter)
// defining port that can be used on local machine as well as heroku server
const port=process.env.PORT;
// starting our server
app.listen(port,()=>{
    console.log('Server is running on port '+port);
})
