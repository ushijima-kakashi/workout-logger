const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

// static signup method
userSchema.statics.signup = async function(email, password){
    if(!email || !password){
        throw Error("all fields must be filled")
    }

    if(!validator.isEmail(email)){ 
        throw Error("valid email nahi hai ")
    }
    if(!validator.isStrongPassword(password)){ 
        throw Error("password is not strong")
    }

    const emailExists = await this.findOne({email})
    if(emailExists){
        throw Error("email already in use")
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await this.create({email, password: hash});
    
    return user;
}

// static login method
userSchema.statics.login = async function(email, password){
    if(!email || !password){
        throw Error("all fields must be filled")
    }

    const user = await this.findOne({email})
    if(!user){
        throw Error("incorrect email")
    }

    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw Error("galat password hai ")
    }

    return user
}


module.exports = mongoose.model('user', userSchema)