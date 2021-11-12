const mongoose = require('mongoose'); 
const userSchema = new mongoose.Schema({
    username:{
        type : "string",
        unique : true, 
        required : true,
    },
    password:{
        type : "string",
        required : true,
    },
    confirm_password:{
        type : "string",
        required : true,
    }
});
userSchema.methods.verifyPassword = function(password){
    if(password !== this.password){
        return false;
    }
    return true;
};

module.exports = mongoose.model('User',userSchema);