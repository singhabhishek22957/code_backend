import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: {
      type: string,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: string,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullName: {
      type: string,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    avatar: {
      type: string, /// cloundinary url
      required: true,
    },
    coverImage: {
      type: string, /// cloundinary url
    },

    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: "video",
    },

    password: {
      type: string,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: string,
    },
  },
  {
    timestamps: true,
  }
);

// is used to check or run something before save tha data into data base such as : password encrypt

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
