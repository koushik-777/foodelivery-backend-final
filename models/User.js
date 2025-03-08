const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    ConfirmPassword:{
        type:String,
        required:true
    }
});

module.exports=mongoose.model('User',UserSchema);