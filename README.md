# attendance-system-nodejs
attendance system nodejs-mongodb
# Install the dependencies and devDependencies and start the server.

```sh
$ yarn 
$ yarn start
```

# Start mongo

  - If on pc

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

