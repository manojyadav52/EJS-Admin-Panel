const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = "baskarpagalirulayegikya";
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');




// Admin Authentication Middleware
const admdinAunthicate = async (req, res, next) => {
    const token = req.cookies.authToken; // Use correct cookie name
    console.log('Token received:', token); // Debug token value

    if (!token) {
        return res
            .json({ message: "Access denied, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Verify token
        if (decoded.role !== "admin") {
            return res
                .status(403)
                .json({ message: "Forbidden, admin access only" });
        }

        req.user = decoded; // Attach user data to request object
        next(); // Pass control to the next middleware
    } catch (err) {
        console.error("Token verification failed:", err.message); // Debug error
        return res
            .status(403)
            .json({ message: "Invalid or expired token" });
    }
};




// / Middleware to verify JWT token
const userVerify = async (req, res, next) => {
    const token = req.cookies.authToken; // Get token from cookies
    console.log('userVerify Token:', token);

    if (!token) {
        return res.json({ message: "Access denied, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userData = decoded; 
       
        next(); 
    } catch (err) {
        console.log(err);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};






// const register = async (req,res)=>{
//     try{
//          const { fullName,email,password,phone,gender} =req.body;
//          const userData = new User({fullName,email,password,phone,gender});
//         //  console.log(userData);
//          await userData.save();
//          res.render('register',{message:"user Register Successfully"});
//     }catch(error){
//         console.log(error);
//         res.render('register',{message:"Internal Server Issue"});
//     }
// };

// registerPage


// register


// register 
const register = async (req, res) => {
    const { fullName, email, password, phone, gender } = req.body;
    try {
        const getData = new User({ fullName, email, password, phone, gender });
        await getData.save();
        const token = await jwt.sign({ id: getData._id, email: getData.email, phone: getData.phone }, SECRET_KEY, { expiresIn: "1h" });
        console.log(token);
        res.status(200).render('login', { message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).render('register', { message: "Internal Server Issue" });
    }
};

// registerPage
const registerPage = async (req, res) => {
    res.render('register', { message: null });
}




const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userData = await User.findOne({ email });
        if (!userData) return res.render('login', { message: "User does not exist" });

        // Compare the password
        const isValidPassword = await bcrypt.compare(password, userData.password);
        if (!isValidPassword) return res.render('login', { message: "Password is incorrect" });

        const token = jwt.sign(
            { id: userData._id, email: userData.email, role: userData.role },
            SECRET_KEY,
            { expiresIn: "1h" }
        );
        // print the token 
        console.log('token in login user: ', token);
        res.cookie('authToken', token, { httpOnly: true });

        // Redirect user based on role
        if (userData.role === 'admin') {
            return res.render('add', { message: "Welcome Admin", user: userData });
        } else {
            return res.render('home', { message: "User Login Successfully", user: userData });
        }
    } catch (error) {
        console.log(error);
        res.render('login', { message: "Internal server issue" });
    }
};


// loginPage
const loginPage = async (req, res) => {
    res.render('login', { message: null });
}



const getAllUser = async (req, res) => {
    try {
        const users = await User.find();  // Fetch all users

        // Check if users exist
        if (users && users.length > 0) {
            // Pass the users to the view
            res.render('userdata', { users: users, message: "User data rendered successfully" });
        } else {
            res.render('userdata', { users: [], message: "No users found" });
        }
    } catch (error) {
        console.log(error);
        res.render('userdata', { users: [], message: "Internal server issue" });
    }
}


// getuser
// const getuser = async (req, res) => {
//     try {
//         const users = await User.find();  // Fetch all users

//         // Check if users exist
//         if (users && users.length > 0) {
//             // Pass the users to the view
//             res.render('userdata', { users: users, message: "User data rendered successfully" });
//         } else {
//             res.render('userdata', { users: [], message: "No users found" });
//         }
//     } catch (error) {
//         console.log(error);
//         res.render('userdata', { users: [], message: "Internal server issue" });
//     }
// }



//   deleteUser
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.render('userdata', { users: [], message: "User not found, unable to delete" });
        }


        const showData = await User.find();

        res.render('userdata', { users: showData, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.render('userdata', { users: [], message: "Internal server error, unable to delete user" });
    }
};


// const deletedPage = async (req,res)=>{
//     res.render('userdata',{messag:"internal server  Issue"});
// }






// const updateuser = async (req, res) => {
//     try {

//       const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

//       if (user) {

//         const showData = await User.find();
//         res.render("updateuser", { users: showData, message: "User updated successfully" });
//       } else {
//         res.render("userdata", { message: "User not updated" });
//       }
//     } catch (error) {
//       console.error(error);
//       res.render("userdata", { message: "Internal Server Issue" });
//     }
//   };

const updateuser = async (req, res) => {
    try {
  
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.render('userdata', { users: [], message: "User not found, unable to update" });
        }


        const showData = await User.find();

        // Render updated user data
        res.render('userdata', { users: showData, message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.render('userdata', { users: [], message: "Internal Server Issue, unable to update user" });
    }
};




// updateuserPage
const updateuserPage = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).render("userdata", { users: [], message: "User not found" });
        }

        res.render("updateuser", { user, message: null });
    } catch (error) {
        console.error("Error fetching user for update:", error);
        res.render("updateuser", { user: null, message: "Internal Server Issue" });
    }
};



//    
// user chang the password
const changePassword = async (req, res) => {
    const { password, newPassword } = req.body;
    try {
        const getData = await User.findOne({ _id: req.getData.id });
        console.log(getData);
        if (!getData) {
            return res.render('changePassword', { message: "User not found" });
        }

        const isValidatePassword = await bcrypt.compare(password, getData.password);
        if (!isValidatePassword) {
            return res.render('changePassword', { message: "Old password is incorrect" });
        }

        const hashNewPassword = await bcrypt.hash(newPassword, 10);
        console.log(hashNewPassword);
        const updateUser = await User.findOneAndUpdate(
            { _id: req.getData.id },
            { $set: { password: hashNewPassword } },
            { new: true }
        );

        const token = jwt.sign({ id: getData._id, email: getData.email, phone: getData.phone }, SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        if (updateUser) {
            return res.status(200).render('home', { message: "Password updated successfully" });
        } else {
            return res.status(404).render('changePassword', { message: "Password not updated" });
        }
    } catch (error) {
        console.error(error);
        return res.render('changePassword', { message: "Internal server issue" });
    }
};

// Render Change Password Page
const changePasswordPage = (req, res) => {
    res.render('changePassword', { message: null });
};




// 

// Forget Password
const forget = async (req, res) => {
    const { email } = req.body;
    try {
        const getData = await User.findOne({ email });
        console.log(getData);
        if (!getData) {
            return res.render('forget', { message: "Please enter a valid email" });
        }

        const generateTokenRandome = (length) => {
            const charcterAll = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let token = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charcterAll.length);
                token += charcterAll[randomIndex];
            }
            return token;
        };

        const resetToken = generateTokenRandome(12);
        getData.resetToken = resetToken;
        getData.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
        await getData.save();

        // Send reset password email
        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "f1c0ab7c43b1a8",
                pass: "e3f188d1c7eeeb"
            }
        });

        const resetLink = `http://localhost:8080/api/resetPassword/${resetToken}`;
        const mailOptions = {
            from: 'no-reply@gmail.com',
            to: email,
            subject: 'Password Reset',
            html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
        };

        await transporter.sendMail(mailOptions);
        res.render('forget', { message: "Password reset email sent" });
    } catch (error) {
        console.error('error', error.message);
        res.status(500).render('forget', { message: "Internal Server Issue" });
    }
};

// Render Forget Password Page
const forgetPage = (req, res) => {
    res.render('forget', { message: null });
};

// Reset Password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        if (!newPassword || newPassword.length < 6) return res.status(400).render('reset', { message: "Password length must be greater than 6" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await User.findOneAndUpdate({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() },
        }, {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
        });

        if (!user) return res.status(404).render('reset', { message: 'Invalid or expired token' });

        res.redirect('/api/login');
    } catch (error) {
        res.status(500).render('reset', { message: "Internal server error" });
    }
};

// Render Reset Password Page
const resetPage = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.render('reset', {
                token: null,
                message: "Invalid or expired token",
            });
        }

        res.render('reset', {
            token: token,
            message: null,
        });
    } catch (err) {
        console.error(err);
        res.render('reset', {
            token: null,
            message: "Internal server error",
        });
    }
};




// exports 
module.exports = {
    register,
    registerPage,

    login,
    loginPage,

    getAllUser,



    deleteUser,


    updateuser,
    updateuserPage,

    changePassword,
    changePasswordPage,

    userVerify,
    admdinAunthicate,

    forget,
    forgetPage,

    resetPassword,
    resetPage,
}

