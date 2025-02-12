const express = require("express");
const jwt = require("jsonwebtoken");
const JWS_SECRET = "howareyou";
const app = express();

const user = [];

function logger(req, res, next) {
  console.log(req.method + " came request");
  next();
}

app.get("/", function (req, res) {
  res.sendfile(__dirname + "/public/index.html");
});

app.use(express.json());

app.post("/signup", logger, function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  user.push({
    username: username,
    password: password,
  });

  res.json({
    message: "You have sign up successfully",
  });

  console.log(user);
});

app.post("/signin", logger, function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  let foundUser = null; //that specific username and password

  foundUser = user.find(function (u) {
    if (u.username == username && u.password == password) {
      return true;
    } else {
      return false;
    }
  });

  if (foundUser) {
    const token = jwt.sign(
      {
        username: username,
      },
      JWS_SECRET // convert username to jwt
    );
    // foundUser.token = token;   do not store the token in database anymore
    res.json({
      token: token,
    });
  } else {
    res.status(403).send({
      message: "Invalid username or password",
    });
    // for (let i = 0; i<user.length; i++) {
    //   if (user[i].username === username && user[i].password === password) {
    //     foundUser = user[i];
    // }
  }

  console.log(user);
});

function auth(req, res, next) {
  const token = req.headers.token;
  const decodedData = jwt.verify(token, JWS_SECRET); //username : mohiht   //decode username from jwt
  req.username = decodedData.username;
  //does username exist
  if (decodedData.username) {
    next();
  } else {
    res.json({
      message: "You are not logged in",
    });
  }
}

app.get("/me", logger, auth, function (req, res) {
  let foundUser = null;
  const currentUser = req.username;

  foundUser = user.find(function (u) {
    if (u.username == currentUser) {
      return true;
    } else {
      return false;
    }
  });

  if (foundUser) {
    res.json({
      username: foundUser.username,
      password: foundUser.password,
    });
  } else {
    res.json({
      message: "taoken invalid",
    });
  }
});

app.listen(3000);
