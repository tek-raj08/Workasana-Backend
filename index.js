const { initializeDatabase } = require("./db/db.connect")
initializeDatabase()
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { userAuth } = require("./middlewares/userAuth")

const app = express()



const allowedOrigins = [
  "http://localhost:5173",
  "https://workasana-frontend-chi.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// app.use(cors());

app.use(express.json())

app.use(cookieParser())

const { authRouter } = require("./routes/auth")
const { projectRouter } = require("./routes/project")
const { taskRouter } = require("./routes/task")
const { teamRouter } = require("./routes/team")
const { tagRouter } = require("./routes/tag")
const { userRouter } = require("./routes/user")

app.use("/", authRouter)
app.use("/", projectRouter)
app.use("/", taskRouter)
app.use("/", teamRouter)
app.use("/", tagRouter)
app.use("/", userRouter)


app.get("/profile", userAuth, async (req, res) => {
   const user = req.user // --> from userAuth
   res.json({ message: "Success", user })

})

app.listen(3000, () => {
   console.log("Server is running on PORT 3000")
})
