const router = require('express').Router();

const {
  addUser, getUsers, getUserById, editUserData, editUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', editUserData);
router.post('/', addUser);
router.patch('/me/avatar', editUserAvatar);

module.exports = router;
