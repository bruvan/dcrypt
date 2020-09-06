const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
var cron = require("node-cron");
var helmet = require("helmet");

const authRoute = require("./routes/auth");
const dashRoute = require("./routes/dashboard");
const boardRoute = require("./routes/leaderboard");
const admin = require("./routes/admin");
const questionRoute = require("./routes/questions");
const shopRoute = require("./routes/shop");

const attackRoute = require("./controllers/attack");
const makerRoute = require("./controllers/questionMaker");
const buyRoute = require("./controllers/buy");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const contentSecurity = require("./middleware/contentSecurity");

const port = 5000 || process.env.PORT;
const Team = require("./models/Team");

require("dotenv").config();

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log("connected to db");
  }
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", authRoute);
app.use("/", dashRoute);
app.use("/", boardRoute);
app.use("/", attackRoute);
app.use("/", makerRoute);
app.use("/", admin);
app.use("/", questionRoute);
app.use("/", shopRoute);
app.use("/", buyRoute);

app.get("/", contentSecurity, (req, res) => {
  res.render("index.ejs", { active: "home" });
});

app.get("/register", contentSecurity, (req, res) => {
  res.render("register.ejs", { active: "register" });
});

app.get("/login", (req, res) => {
  res.render("login.ejs", { active: "login" });
});

fpIncrease = cron.schedule(
  "* * * * *",
  () => {
    Team.find({}, function (err, docs) {
      docs.forEach((element) => {
        if (element.powerupTimer > 0) {
          Team.updateOne(
            { email: element.email },
            {
              $inc: {
                powerupTimer: -1,
              },
            },
            { multi: true },
            timercallback
          );
          function timercallback(err, num) {
            if (err) {
              console.log(err);
            }
          }
        } else {
          Team.updateOne(
            { email: element.email },
            {
              $set: {
                dpVisible: false,
                shield: false,
                multiplier: false,
              },
            },
            { multi: true },
            timeupcallback
          );
          function timeupcallback(err, num) {
            if (err) {
              console.log(err);
            }
          }
        }
      });
    });
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);
fpIncrease.start();

app.listen(port, () => console.log(`running on port ${port}`));
