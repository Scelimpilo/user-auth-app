import { check } from "express-validator";

const name = check("name", "Name is Required.").not().isEmpty();
const username = check("username", "Username is Required.").not().isEmpty();
const email = check("email", "Please Provide a valid email address").isEmail();
const password = check(
    "password", 
    "Password is Required of Minimum length of 6."
    )
    .not()
    .isLength({
        min: 6,
    });

// this will act as Middleware to express routers
export const RegisterValidations = [password, name, username, email];
export const AuthenticatedValidations = [username, password]