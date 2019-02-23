
const auth = require('../controllers/authControllers'); //contains controllers for user and authentication

const authRouter = require('express').Router();


authRouter.get("/login", auth.reDirectLogin, auth.loginForm);
authRouter.post("/login", auth.login);

authRouter.get("/register", auth.registerForm);
authRouter.post("/register", auth.register, auth.login);
authRouter.get("/logout", auth.logout);

authRouter.use("/", auth.isLoggedIn);
authRouter.get("/profile", auth.profileForm);





module.exports = authRouter;