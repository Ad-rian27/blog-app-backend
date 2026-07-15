const Express = require("express")
const Mongoose = require("mongoose")
const Bcrypt = require("bcrypt")
const Cors = require("cors")
const jwt = require("jsonwebtoken")
const userModel = require("./models/users")

let app = Express()

app.use(Express.json())
app.use(Cors())
Mongoose.connect("mongodb+srv://adrian:adrian123@cluster0.veegpvo.mongodb.net/blogapp?appName=Cluster0")


//Sign In
app.post("/signin", async (req, res) => {

    let input = req.body

    let result = userModel.find({ email: req.body.email }).then(
        (items) => {
            if (items.length > 0) {

                const passwordValidator = Bcrypt.compareSync(
                    req.body.password,
                    items[0].password
                )

                if (passwordValidator) {
                    jwt.sign(
                        { email: req.body.email },
                        "blogApp",
                        { expiresIn: "1d" },
                        (error, token) => {
                            if (error) {
                                res.json({
                                    "status": "error",
                                    "errorMessage": error
                                })
                            }
                            else {
res.json({ "status": "success", "token":token, "userId":items[0]._id })
                            }
                        }
                    )
                } else {
                    res.json({ "status": "Incorrect Password"})
                }

            } else {
                res.json({ "status": "Invalid Email Id" })
            }
        }
    ).catch()

})




//Sign up
app.post("/signup", async (req, res) => {
    let input = req.body
    let hashedPassword = Bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword
    console.log(input)

    userModel.find({ email: req.body.email }).then(
        (items) => {
            if (items.length > 0) {
                res.json({ "status": "email Id already exists" })
            } else {
                let result = new userModel(input)
                result.save()
                res.json({ "status": "success" })
            }
        }
    ).catch(
        (error) => { }
    )


}


)

app.listen(3000, () => {
    console.log("Server started")
})