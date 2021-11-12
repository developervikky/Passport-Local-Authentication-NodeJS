const app = require('./app');
const port = process.env.PORT || 3080; 
app.listen(port,function(){
    console.log(`Server running on ${port}...`)
});