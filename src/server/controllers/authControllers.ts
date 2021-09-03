import { UploadApiResponse } from "cloudinary";
import crypto from "crypto";
import absoluteUrl from "next-absolute-url";

import User from "../models/user";
import FileService from "../services/file.service";
import ErrorHandler from "../utils/errorHandler";
import sendEmail from "../utils/sendEmail";

// Register user   =>   /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password, avatar, company } = req.body;

  let result: UploadApiResponse | undefined;
  if (avatar) {
    result = await FileService.uploadImage(req.body.avatar, {
      width: 150,
      crop: "scale",
    });
  } else {
    result = undefined;
  }

  await User.create({
    name,
    email,
    password,
    company,
    avatar: result
      ? {
          public_id: result.public_id,
          url: result.url,
        }
      : undefined,
  });

  res.status(201).json({
    success: true,
    message: "Account Registered successfully",
  });
};

// Cuurent user profile   =>   /api/me
const currentUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
};

// Update user profile   =>   /api/me/update
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (req.body.name) user.name = req.body.name;
    if (req.body.password) user.password = req.body.password;
  }

  // Update avatar
  if (req.body.avatar !== "") {
    const image_id = user.avatar?.public_id ?? undefined;
    if (image_id) {
      await FileService.removeImage(image_id);
    }

    const result = await FileService.uploadImage(req.body.avatar, {
      width: 150,
      crop: "scale",
    });

    user.avatar = {
      public_id: result.public_id,
      url: result.url,
    };
  }

  await user.save();

  res.status(200).json({
    success: true,
  });
};

// Forgot password   =>   /api/auth/forgot
const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new ErrorHandler("User not found with this email", 404);
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Get origin
  const { origin } = absoluteUrl(req);

  // Create reset password url
  const resetUrl = `${origin}/password/reset/${resetToken}`;

  const message = `Your password reset url is as follow: \n\n ${resetUrl} \n\n\ If you have not requested this email, then ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Demo System Password Recovery",
      message,
    });

    res.status(201).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    throw new ErrorHandler(error.message, 500);
  }
};

// Reset password   =>   /api/auth/reset/:token
const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.query.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ErrorHandler(
      "Password reset token is invalid or has been expired",
      400
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    throw new ErrorHandler("Password does not match", 400);
  }

  // Setup the new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
};

// Get all users   =>   /api/admin/users
const allAdminUsers = async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
};

// Get user details  =>   /api/admin/users/:id
const getUserDetails = async (req, res) => {
  const user = await User.findById(req.query.id);

  if (!user) {
    throw new ErrorHandler("User not found with this ID.", 400);
  }

  res.status(200).json({
    success: true,
    user,
  });
};

// Update user details  =>   /api/admin/users/:id
const updateUser = async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.query.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
};

// Delete user    =>   /api/admin/users/:id
const deleteUser = async (req, res) => {
  if (req.user._id === req.query.id) {
    throw new ErrorHandler("Cannot delete yourself.", 400);
  }
  const user = await User.findById(req.query.id);

  if (!user) {
    throw new ErrorHandler("User not found with this ID.", 400);
  }

  // const image_id = user.avatar.public_id;
  // await FileService.removeImage(image_id);

  await user.remove();

  res.status(200).json({
    success: true,
    user,
  });
};

export {
  registerUser,
  currentUserProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  allAdminUsers,
  getUserDetails,
  updateUser,
  deleteUser,
};
