
const express = require("express");
const path = require("path");
require("dotenv").config();
const fs = require("fs");
const port =process.env.PORT || 5000;
const app = express();
const mongoose = require("mongoose");
const mongourl=process.env.DATABASE
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    mongourl
  );
}

//DEFINE MONGOOSE SCHEMA
const kittySchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  message: String,
});

// CREATE MODEL
const Contact = mongoose.model("Contact", kittySchema);

// const silence = new Contact({ name: 'helloSilence' });
// console.log(silence.name); // 'Silence'

//EXPRESS SPECIFIC STUFF
app.use("/static", express.static("static"));
app.use(express.urlencoded());

//PUG SPECIFIC STUFF
app.set("view engine", "pug"); //Set the template engine as pug
app.set("views", path.join(__dirname, "views")); //set the views directory

//ENDPOINTS
app.get("/", (req, res) => {
  const params = {};
  res.status(200).render("index.pug", params);
});

//WITHOUT DATABASE (SAVING DATA IN A FILE)

// app.post('/',(req,res)=>{
//     console.log(req.body)
//     const name=req.body.name
//     const phone=req.body.phone
//     const email=req.body.email
//     const about=req.body.message
//     const output=`The name of the member is ${name},phone no. is ${phone},information about them is ${about} end their email is ${email}`
//     fs.writeFileSync("output.txt",output)
//     const params={'message':"Your form has been submitted successfully."}
//     res.status(200).render('index.pug',params)
// })

// app.post('/',(req,res)=>{
//     console.log(req.body);
//     var newData=new Contact(req.body);

//     newData.save().then(()=>{
//       res.send("Thank you for submitting your response.")
//     }).catch(()=>{
//       res.status(400).send("There was some error while submitting your response. Please try again later.")
//     })

// })

app.post("/", (req, res) => {
  console.log(req.body);
  var newData = new Contact(req.body);
  newData
    .save()
    .then(() => {
      res.render("response.pug", {
        message: "Your form has been submitted successfully.",
      });
    })
    .catch(() => {
      res
        .status(400)
        .render("response.pug", {
          message:
            "There was some error while submitting your response. Please try again later.",
        });
    });
});

//START THE SERVER
app.listen(port, () => {
  console.log(`The server is running successfully on port ${port}`);
});
