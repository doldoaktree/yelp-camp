const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const {campgroundSchema, reviewSchema} = require('./schemas.js')
const catchAsync = require("./utilities/catchAsync");
const ExpressError = require("./utilities/ExpressError");
const methodOverride = require("method-override");
const app = express();
const port = 3000;

const campGround = require("./models/campground");
const Review = require('./models/review');
// const { redirect } = require("express/lib/response");
// const { errorMonitor } = require("events");
// const { resourceLimits } = require("worker_threads");



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

const validateCampground = (req, res, next)=>{

  const {error} = campgroundSchema.validate(req.body);
  if(error){
    //  const msg = error.details.map(el => el.message).join(',');
    const errorD = error.details;
    const msg =errorD.map(el => el.message).join();
    console.log(msg)
    throw new ExpressError(msg,400)
  }else{
    next();
  }
}
debugger
const validateReview = (req, res, next)=>{
  const {error} = reviewSchema.validate(req.body);
  if(error){
    const errorD = error.details;
    const msg =errorD.map(el => el.message).join();
    console.log(msg)
    throw new ExpressError(msg,400)
  }else{
    next();
  }

}



app.get("/", catchAsync(async (req, res) => {
  res.render("home");
}));

app.get("/campgrounds", catchAsync(async (req, res, next) => {
  const campgrounds = await campGround.find({});
  res.render("campgrounds/index", { campgrounds });
}));

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground',400)
   
    const campground = new campGround(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
 }));

app.get("/campgrounds/:id", catchAsync(async (req, res) => {
  const campground = await campGround.findById(req.params.id);
  console.log(req.params.id)
  console.log(campground)
  res.render("campgrounds/show", { campground });
}));

app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
  const campground = await campGround.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
}));

app.put("/campgrounds/:id/",validateCampground, catchAsync(async (req, res) => {
  const {id} = req.params;
  const campground = await campGround.findByIdAndUpdate(id,{...req.body.campground},{new:true})
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
  const{id}= req.params;
  console.log({id});
  await campGround.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}));


// REVIEW


app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req,res) => {

  const campground = await campGround.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}));


app.all('*', (req,res,next)=>{
  next(new ExpressError('Sorry, I dunno.?', 404))
});


// 623ab715ef7e6885f56d3df1

app.use((err, req, res, next)=>{
  const{statusCode = 500} = err
  if(!err.message) err.message = 'Uh Ohhh Something went wrong!'
  res.status(statusCode).render('error', {err});
});


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});



