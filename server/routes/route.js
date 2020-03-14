const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.get(
  "/user/:userId",
  userController.allowIfLoggedin,
  userController.getUser
);


router.get(
  "/users",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  userController.getUsers
);
//get student route
router.get(
  "/students",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  userController.getStudents
);
router.get(
  "/students/:subjectParam",
  userController.allowIfLoggedin,
  userController.getStudentswithSubject
);

router.get(
  "/getClasses/:subjectParam",
  userController.getClasses
);

//student checking his attandance
router.get(
  "/stuAtt/",
  //userController.allowIfLoggedin,
 // userController.grantAccess("updateAny", "profile"),
  //userController.getClasses,
  userController.getStudentsAttandanceStatus
);

//attandance coomence
router.post(
  "/attendance/",
  userController.allowIfLoggedin, 
 userController.grantAccess("updateAny", "profile"),
  //userController.getClasses,
  userController.AttendanceCommence
);

router.put(
  "/user/:userId",
  userController.allowIfLoggedin,
  userController.grantAccess("updateAny", "profile"),
  userController.updateUser
);
router.delete(
  "/user/:userId",
  userController.allowIfLoggedin,
  userController.grantAccess("deleteAny", "profile"),
  userController.deleteUser
);


module.exports = router;
