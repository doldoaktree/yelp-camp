const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const campGround = require("../models/campground");

async function seeds() {
  await mongoose.connect("mongodb://localhost:27017/yelp-camp");
  console.log("DATABASE CONNECTED!");
}
seeds().catch((err) => {
  console.log("Errr, need help here!");
  console.log(err);
});

// mongoose.connect("mongodb://localhost:27017/yelp-camp");
// const db= mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', ()=>{
//   console.log('DATABASE CONNECTED');
// });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await campGround.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new campGround({
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title:`${sample(descriptors)} ${sample(places)}`
    });
    await camp.save();
  }
};

seedDB().then(() => {
mongoose.connection.close
});
