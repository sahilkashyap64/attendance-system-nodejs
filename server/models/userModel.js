const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const baseOptions = {
  discriminatorKey: 'userType', // our discriminator key, could be anything
  //collection: 'items', // the name of our collection
};

//base model

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: { type: String, required: true },
  role: {
    type: String,
    default: "student",
    enum: ["student", "teacher", "admin"]
  },
  accessToken: { type: String }
},baseOptions,);

//teacher schema
const TeacherSchema = new Schema({
  subject: { type: String, required: true },
});

//student schema
const StudentSchema = new Schema({
  subject: { type: String, required: true },
  attendance_status:{
    type: String,
    default: "A",
    enum: ["P", "A"]
  }
});

const User = mongoose.model("user", UserSchema);

const TeacherUser = User.discriminator('TeacherUser', TeacherSchema);
const StudentUser = User.discriminator('StudentUser', StudentSchema);

module.exports = {User,TeacherUser,StudentUser};
