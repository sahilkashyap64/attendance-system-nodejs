const {User,TeacherUser,StudentUser} = require("../models/userModel");
const {Attendance}= require("../models/attendanceModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { roles } = require("../roles");

//to hash the password
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}
//to validate the password
async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
//to signup. if role not mentioned ,default is student
exports.signup = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;//get these 3 field from form body
    const hashedPassword = await hashPassword(password);//hash the password
    var newUser;
    if(role=="student"){  
       newUser = new StudentUser({
        email,
        password: hashedPassword,
        role: "student", //New user data compared with Studentschema
        subject:req.body.subject //subject needed
      });
    }else if (role=="teacher") {
      newUser = new TeacherUser({
        email,
        password: hashedPassword,
        role: "teacher", //New user data compared with teacherchema
        subject:req.body.subject //subject needed
      });
    } else{
    newUser = new User({
      email,
      password: hashedPassword,
      role: role || "student" //New user data compared with userschema
    });}
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );
    newUser.accessToken = accessToken;
    await newUser.save();//new user saved
    res.json({ data: newUser, accessToken });//response given
  } catch (error) {
    next(error);
  }
};
//to login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;//get email and password from form
    const user = await User.findOne({ email }); //look for the email
    if (!user) return next(new Error("Email does not exist!")); //email not found show error
    const validPassword = await validatePassword(password, user.password);//wait for the password comparison
    if (!validPassword) return next(new Error("Password is not correct"));//password unmatched show error
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    await User.findByIdAndUpdate(user._id, { accessToken });//add access token with it
    res.status(200)
      .json({ data: { email: user.email, role: user.role }, accessToken });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find({});//get all user from db
  res.status(200).json({
    data: users
  });
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;//get user by passing user_id
    const user = await User.findById(userId);
    if (!user) return next(new Error("User does not exist"));//no user found with id show error
    res.status(200).json({
      data: user
    });
  } catch (error) {
    next(error);
  }
};
///get users whose role is student
exports.getStudents = async (req, res, next) => {
  const users = await User.find({"role": "student"});//get all user from db
  res.status(200).json({
    data: users
  });
};
//get student with matching subjects with teacher 
exports.getStudentswithSubject = async (req, res, next) => {
  const subjectParam = req.params.subject;
  var findquery = { "role": "student", "subject":subjectParam};
  const users = await User.find(findquery);//get all user from db
  res.status(200).json({
    data: users
  });
  
};
//for student to see if he is present or not sub + email +date is required
///get users whose role is student
exports.getStudentsAttandanceStatus = async (req, res, next) => {
  const sub="chem"; const email="student2@gmail.com"; 
      //to do date
       const attendance = await Attendance.find({'professorclass.email' : email,'subject' : sub,},{'professorclass.$': 1 ,'attendate':1, _id: 0});
  res.status(200).json({
    data: attendance
  });
};

// professor with his student who have same subject by default chemistry is passed
exports.getClasses = async (req, res, next) => {
  const subjectParam = req.params.subject;
  const profeclass =  await TeacherUser.aggregate([{
    $match : { "subject" : "chem" }},{ "$project": {"role":1,"email":1,"subject":1,"userType":1}},{$lookup:{from:"users",  pipeline: [
      { $match: { "subject": "chem", "role": "student"}},
      { "$project": {"role":1,"email":1,"subject":1,"userType":1,"attendance_status":1}}
    ],
          
           as: "professorclass"}}]);
           var cdate = new Date().toLocaleString('default', { dateStyle: 'medium', timeStyle: 'short' });

           const attand = new Attendance({
            role:profeclass[0].role,
            userType:profeclass[0].userType,
            email:profeclass[0].email,
            subject:profeclass[0].subject,
            professorclass:profeclass[0].professorclass,
            attendate:cdate
            
          });
         const att=  await attand.save();
  res.status(200).json({
    data: profeclass,classCreated:att
  });
  
};

//add the class(students+teacher) in attendance schema

exports.AttendanceCommence = async (req, res, next) => {
  try {
    const { email, subject} = req.body
    var someData = [
      {email: "student2@gmail.com", subject: "chem"},
      {email: "student1@gmail.com", subject: "chem"},
   ];
   var sub=someData[0].subject;
   console.log(sub);
   function listEmails(email) {
    let product_names = [];
    for (let i=0; i<email.length; i+=1) {
     product_names.push(email[i].email);
     
    }
    return product_names;
  }
  //console.log(listEmails(someData));

  const Allstudentsaag =  await Attendance.aggregate(
    [ { $match : { "subject" : sub  } } ,
    { $project : { _id: 0,email:1, professorclass : 1  ,
       numberofstudent: { $cond: { if: { $isArray: "$professorclass" }, then: { $size: "$professorclass" }, else: "NA"} }}},]);//get all user from db
    

   //update those student whose email & subject was passed 
     
   const files = await listEmails(someData);
    

   await Promise.all(files.map(async (file) => {
     
    const updatestatus=await Attendance.update(
      { },
      { $set: { "professorclass.$[elem].attendance_status" :  "SES" } },
      {
        multi: true,
        arrayFilters: [ { "elem.role": { $eq: "student" }, "elem.subject": { $eq: sub}, "elem.email": { $eq: file}} ], multi: true
      }
   );

   console.log(updatestatus);
   console.log(file);
  }));
    

   res.status(200).json({
    data: Allstudentsaag,
  });
    
    
  } catch (error) {
    next(error);
  }
};


exports.updateUser = async (req, res, next) => {
  try {
    const update = req.body;
    const userId = req.params.userId;
    
    const user = await StudentUser.findByIdAndUpdate(userId, update,{new:true});
    res.status(200).json({
      data: user,
      //body:update,
      message: "Student has been updated"
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      data: null,
      message: "User has been deleted"
    });
  } catch (error) {
    next(error);
  }
};
exports.grantAccess = function(action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res.status(401).json({
        error: "You need to be logged in to access this route"
      });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
//for attendance
//createing attendance

exports.createAttendance = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;//get these 3 field from form body
    
    
    
    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || "student" //New user data compared with userschema
    });
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );
    newUser.accessToken = accessToken;
    await newUser.save();//new user saved
    res.json({ data: newUser, accessToken });//response given
  } catch (error) {
    next(error);
  }
};