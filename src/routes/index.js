const router = require('express').Router();

// ---------------------------------------------------CONTROLLER-------------------------------------------------

const { register, login, checkAuth } = require('../controller/auth');
const {
	getUser,
	getUsers,
	deleteUser,
	updateUser,
} = require('../controller/user');

const {
	addLiterature,
	getLiteratures,
	getLiterature,
	getUserLiterature,
	updateLiterature,
	deleteLiterature,
} = require('../controller/literature');

const {
	getCollections,
	addCollection,
	getCollection,
	deleteCollection,
	getCollectionID,
} = require('../controller/collection');
// ---------------------------------------------------MIDDLEWARES-------------------------------------------------

const { auth } = require('../middlewares/auth');
const { uploadImage } = require('../middlewares/uploadImage');
const uploadFile = require('../middlewares/uploadFile');

// ---------------------------------------------------ROUTER----------------------------------------------------

// USERS
router.post('/register', register);
router.post('/login', login);
router.get('/check-auth', auth, checkAuth);
router.get('/users', auth, getUsers);
router.get('/user', auth, getUser);
router.patch('/users', auth, uploadImage('image', 'profilePic'), updateUser);
router.delete('/users/:id', auth, deleteUser);
router.get('/users/literature', auth, getUserLiterature);

// LITERATURES
router.post('/literatures', auth, uploadFile(), addLiterature);
router.get('/literatures', getLiteratures);
router.get('/literatures/:id', getLiterature);
router.patch('/literatures/:id', auth, updateLiterature);
router.delete('/literatures/:id', deleteLiterature);

// COLLECTIONS
router.post('/collections', auth, addCollection);
router.get('/collections', getCollections);
router.get('/collection', auth, getCollection);
router.get('/collections/:id', auth, getCollectionID);
router.delete('/collections/:id', auth, deleteCollection);

module.exports = router;
