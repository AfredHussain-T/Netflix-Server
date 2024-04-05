const router = require('express').Router();
const { verify } = require('../config/jwtProvider');

const UserController = require('../controllers/UserController');

// update user

router.put("/:id", verify, UserController.updateUser);

// delete user

router.delete("/:id", verify, UserController.deleteUser);

// get user

router.get("/find/:id", UserController.getUser);

// get all users

router.get("/", verify, UserController.getAllUsers);

// Get User Stats

router.get("/stats", UserController.userStats);

module.exports = router;