import { Schema, model } from "mongoose";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { randomBytes } from "crypto";
import { SECRET } from "../constants";
import { pick } from "loadash";


 const UserSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    username : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        required: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpiresIn: {
        type: Date,
        required: false
    },
 }, 
 { timestamps: true }
 );

// Hooks give functionality to the model 
 UserSchema.pre("save", async function (next) {
     // if we used the arrow function we wouldn't have been able to use the word _this_
     let user = this;
     if (!user.isModified("password")) return next();
     // if password is modified this function will execute
     // 10 rounds of Salt
     user.password = await hash(user.password, 10);
     next();
 });

 // Comparing Hashes genarated between these two passwords
 UserSchema.methods.comparePassword = async function (password) {
    return await compare(password, this.password);
 };
// Generate login token for our application
 UserSchema.methods.generateJWT = async function () {
    let payload = {
        username: this.username,
        email: this.email,
        name: this.name,
        id: this._id,
    }
    return await sign(payload, SECRET, { expiresIn: "1 day" });
 };

 // Password reset will be valid for a day then expire.
 UserSchema.methods.generatePasswordReset = function () {
     this.resetPasswordExpiresIn = Date.now() + 36000000;
     this.resetPasswordToken = randomBytes(20).toString("hex");

 };

 // Get user info
 UserSchema.methods.getUserInfo = function () {
     return pick(this, ["_id", "username", "email", "name"]);
 };

 // export
const User = model("users", UserSchema);
export default User;