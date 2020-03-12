const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AttendanceSchema = new Schema({
    role: {
        type: String,
    
        required:'role is required'
    },
    userType: {
        type: String,
    
        required:'usertype is required'
    },
    email: {
        type: String,
    
        required:'email is required'
    },
    attendate: {
        type: Date,
        required:true,
        default: Date
    },
    
    subject: {
        type: String,
        required:true
    },
    
    professorclass:{
        type: [
          
        ]
      }
});
const Attendance = mongoose.model("Attendance", AttendanceSchema);
module.exports = {Attendance};