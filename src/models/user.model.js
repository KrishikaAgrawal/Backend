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
        type:
    }
});

export const User = mongoose.model("User", userSchema);
