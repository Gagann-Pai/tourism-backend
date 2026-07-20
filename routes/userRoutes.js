const express = require('express');
const router = express.Router();
const { signup, login, logout, getCurrentUser, addFavourite, removeFavourite, getFavourites } = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getCurrentUser);
router.post('/favourite', addFavourite);
router.delete('/favourite', removeFavourite);
router.get('/favourites', getFavourites);

module.exports = router;