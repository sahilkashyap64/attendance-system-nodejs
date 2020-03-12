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
  "/students/:subjectParam",
  userController.allowIfLoggedin,
  userController.getStudentswithSubject
);

router.get(
  "/getClasses",
  userController.getClasses
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

router.put(
  "/user/:userId",
  userController.allowIfLoggedin,
  userController.grantAccess("updateAny", "profile"),
  userController.updateUser
);
//attandance coomence
router.get(
  "/attendance/",
  //userController.allowIfLoggedin,
 // userController.grantAccess("updateAny", "profile"),
  //userController.getClasses,
  userController.AttendanceCommence
);
//student checking his attandance
router.get(
  "/stuAtt/",
  //userController.allowIfLoggedin,
 // userController.grantAccess("updateAny", "profile"),
  //userController.getClasses,
  userController.getStudentsAttandanceStatus
);
router.delete(
  "/user/:userId",
  userController.allowIfLoggedin,
  userController.grantAccess("deleteAny", "profile"),
  userController.deleteUser
);

module.exports = router;
