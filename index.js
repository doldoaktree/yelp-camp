const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const app = express();
const port = 3000;

const campGround = require("./models/campground");

// mongoose.connect("mongodb://localhost:27017/yelp-camp");
// const db= mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', ()=>{
//   console.log('Database connected');
// });

async function main() {
  await mongoose.connect("mongodb://localhost:27017/yelp-camp");
  console.log("CONNECTION OPEN!");
}

main().catch((err) => {
  console.log("Houston, we have a problem!");
  console.log(err);
});

app.engine('ejs', ejsMate)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await campGround.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const campground = new campGround(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const campground = await campGround.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await campGround.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id/", async (req, res) => {
  const{id}= req.params;
  const campground = await campGround.findByIdAndUpdate(id,{...req.body.campground})
  res.redirect(`/campgrounds/${campground._id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
  const{id}= req.params;
  await campGround.findByIdAndDelete(id);
  res.redirect('/campgrounds');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});