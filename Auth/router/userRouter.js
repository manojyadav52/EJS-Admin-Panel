const express = require('express');
const { register, registerPage, login, loginPage, getAllUser, deleteUser, updateuser, updateuserPage, changePassword, changePasswordPage, userVerify, admdinAunthicate, forget, forgetPage, resetPassword, resetPage} = require('../controller/userControle');
const router = express.Router();




router.post('/register',register);
router.get('/register',registerPage);

router.post('/login',login);
router.get('/login',loginPage);

router.get('/getAllUser', getAllUser);
// router.get('/getuser',getuser);

router.post('/deleteuser/:id',deleteUser);


router.post('/updateuser/:id',admdinAunthicate,updateuser);
router.get('/updateuser/:id',admdinAunthicate,updateuserPage);

router.post('/changePassword',userVerify,changePassword);
router.get('/changePassword',userVerify ,changePasswordPage);

router.post('/forget', forget);
router.get('/forget', forgetPage);


router.post('/resetPassword/:token',resetPassword);
router.get('/resetpassword/:token',resetPage);
// exports the router
module.exports = router;