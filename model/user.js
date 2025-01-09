const mongoose = require("mongoose");
const crypto = require("crypto");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: false },
    email: { type: String, required: false },
    password: { type: String, required: false },
    passwordResetExpires: { type: Date, default: null },
    passwordResetToken: { type: String, default: null },
    accountVerificationToken: { type: String, default: null },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"]
    }

  },

  { timestamps: true }
);


// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


// Method to compare the provided password with the stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {

  const result = await bcrypt.compare(candidatePassword, this.password);
  return result
};



// Method to generate a password reset token
userSchema.methods.createPasswordResetCode = function () {
  // Generate a random number between 10000 and 99999
  const code = crypto.randomInt(10000, 100000); // 100000 is exclusive

    // Set token to be valid for 1 hour
    this.passwordResetToken = code;
    this.passwordResetExpires = Date.now() + 3600000; // 1 hour from now
  
  return code;



  return resetToken;
};

// Method to check if the reset token is valid (not expired)
userSchema.methods.isPasswordResetTokenValid = function (token) {
  return (
    this.passwordResetToken === token && this.passwordResetExpires > Date.now()
  );
};

// Method to generate account verification token
userSchema.methods.createEmailVerificationToken = function () {
  const emailToken = crypto.randomBytes(20).toString('hex');

  // Set account verifcation token
  this.accountVerificationToken = emailToken;


  return emailToken;
};


// Method to check if the email Verification token is valid 
userSchema.methods.isEmailVerificationTokenValid = function (emailToken) {
  return (
    this.accountVerificationToken = emailToken
  );
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
