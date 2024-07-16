import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: String,
  surname: String,
  email: String,
  token: String,
  level: Number,
  words: [String],
});
const User = mongoose.model("User", UserSchema);
export default User;
