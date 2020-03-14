# attendance-system-nodejs
attendance system nodejs-mongodb
# Install the dependencies and devDependencies and start the server.

```sh
$ yarn 
$ yarn start
```

# Start mongo

  - If on your computer

```sh 
$ mongod 
$ mongo
```
alternative use mongodb atlas
in server.js

```sh 
mongoose
  .connect("mongodb+srv://myusername:mypassword@cluster0-somelocation.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the Database successfully");
  });
  ```
![](https://github.com/EduardoRotundaro/crud-api-express-mongo/blob/master/docs/images/01.png?raw=true)

# Attendance API w/ Express.js and MongoDB

A backend application using Node.js with the Express framework, that implements a simple CRUD with the MongoDB.
●Build an attendance application where a student and teacher can log in and sign up.
NOTE: store password hashed
● Where teachers can take attendance of the students in their class.
● Students can only see the current status of their attendance.

---

## Stack

| Lib | Version |
| ------ | ------ |
| express | ^4.17.1 |
| accesscontrol | ^2.2.1 |
| bcrypt | ^3.0.6 |
| jsonwebtoken | ^8.5.1 |

---

## Running

**After clone**

```sh
$ cd attendance-system-nodejs
$ npm install
```

**Starting the application**

```sh
$ npm start
```

or

```sh
$ node index.js
```

---

## Routes

* Sign up role-based [Admin/Teacher/Student] if role is[Teacher or student] a subject is required
```sh
method: "POST"
url: "/signup"
body: {
    "email": <String>,
    "password": <String>,
    "role": <String>, 
    "subject":<String> // if role is teacher or student
}
```

* Sign in
```sh
method: "POST"
url: "/login"
body: {
    "email": <String>,
    "password": <String>
}
```

* Get a single user
```sh
method: GET
url: "/user/:userId"
```

* Get all users [Log in required]
```sh
method: GET
url: "/users"
```

* Get users whose role is student [Log in required]
```sh
method: GET
url: "/students"
```

* Get students with the subject [Log in required]
```sh
method: GET
url: "/students/:subjectParam
```
* Get students with matching subjects, 
* a new attendance entry in attendance table
* will be created with all the data with current date
```sh
method: GET
url: "/getClasses/:subjectParam"
```
* student checking his attandance
```sh
method: GET
url: "/stuAtt
```
*Teacher login required
* start taking attendance only for those students 
* whose email and subject were passed
* an array of object that contains the student email and subject
*these students will be set as present
```sh
method: "POST"
url: "/attendance"
body: {
    [
      {email: "student2@mail.com", subject: "chem"},
      {email: "student1@mail.com", subject: "chem"},]
}
```

* Edit a user profile
```sh
method: "PUT"
url: "/user/:userId"
body: {
    any parameter can be updated
}


* Delete a user
```sh
method: "DELETE"
url: "/user/:userId"
```

