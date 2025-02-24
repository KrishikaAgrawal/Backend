import mongoose, { Schema } from "mongoose";
// both uses cryptographic algos
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true, // good to enable index on such fields where we want to optimize searching, but this is costly
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  fullname: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  avatar: {
    type: String, // cloudinary url will be user to retrieve image
    required: true,
  },
  coverImage: {
    type: String, // claudinary url
  },
  watchHistory: [
    // this contain multiple videos, so stored in array
    {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    ],
    password: {
        type: String,  // need to be encrypted 
        required:[true,'Password is required'], // custom error msg 
    },
    refreshToken: {
      type: String;
    }
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); 
  this.password = await bcrypt.hash(this.password, 10)  // await coz it will take time to hash it
  next()
})

// custom method to check password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password,this.password) 
}  

// custom method to generate refresh and access token
userSchema.methods.generateAccessToken = function () {
  // jwt.sign()  // method to generate token sign(payload:string|object,SecretOrPrivateKey,expiresIn)
  return jwt.sign({  // passing as payload
    _id: this._id,  // all other things can be accessed from db using id or we can pass it here directly
    email: this.email,
    username: this.username,
    fullname: this.fullname,
  },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY 
    }
  )
} // this process doesn't take much time, so no need to make it async function, but we can

// same way to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({  
    _id: this._id,  // info is less in this, as it refresh more
  },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY 
    }
  )
}

export const User = mongoose.model("User", userSchema);
