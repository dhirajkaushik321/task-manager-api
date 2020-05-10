const app=require('./app')
// defining port that can be used on local machine as well as heroku server
const port=process.env.PORT;
// starting our server
app.listen(port,()=>{
    console.log('Server is running on port '+port);
})
