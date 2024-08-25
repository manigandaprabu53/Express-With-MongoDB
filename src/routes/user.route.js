import express from 'express';
import userController from '../controller/user.controller.js';

const router = express.Router();

router.get('/getAllUsers', userController.getAllUsers);
router.get('/getUserById/:id', userController.getUserById)
router.post('/createUser', userController.createUser);
router.put('/ediUserById/:id', userController.ediUserById);
router.delete('/deleteUserById/:id', userController.deleteUserById);

export default router;