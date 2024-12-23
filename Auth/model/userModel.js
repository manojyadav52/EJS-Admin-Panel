const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');

// Define the Mongoose schema
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default:"user",
    },
    resetToken: { 
        type: String, 
        default: null,
    }, 
    resetTokenExpiry: { 
        type: Date, 
        default: null,
     },
});

// Pre-save hook to hash the password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


// const validateUser = (user) => {
//     const schema = Joi.object({
//         fullName: Joi.string().min(3).max(50).required(),
//         email: Joi.string().email().required(),
//         password: Joi.string().min(3).required(),
//         phone: Joi.number().integer().required(),
//         gender: Joi.string().valid("male", "female"),
//         // role: Joi.string().valid("admin", "user"),
//     });

//     return schema.validate(user);
// };


const User = mongoose.model("User", userSchema);

module.exports =  User ;
