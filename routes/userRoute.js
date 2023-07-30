const express=require('express');
const { registerUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile} = require('../controllers/userController');
const { loginUser } = require('../controllers/userController');
const {isAuthenticatedUser}=require('../middleware/auth');
const router=express.Router();

router.route("/register").post(registerUser);

router.route('/login').post(loginUser);

router.route("/me").get(isAuthenticatedUser,getUserDetails);

router.route("/logout").put(logout);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route("/password/update").put(isAuthenticatedUser,updatePassword);

router.route("/me/update").put(isAuthenticatedUser,updateProfile);


// router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUser);

// router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser);

// router.route("/admin/user/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser);

// router.route("/admin/user/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateRole);


module.exports=router;