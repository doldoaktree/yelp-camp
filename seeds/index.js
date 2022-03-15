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
    const price = Math.floor(Math.random()*20)+10;
    const camp = new campGround({
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title:`${sample(descriptors)} ${sample(places)}`,
      image:'https://source.unsplash.com/collection/3873343',
      description:'Campsites are frequented by very, overly friendly kangaroos. At night, ensure you put away all food securely. We have woken to hear kangaroos trying to get into our food pantry.  During the day, the same rule applies - food put away when not in use!! The kangaroos will come through and go through your bins, eat anything they find (eg. maps) or try to get into tents where food might be, so zip up tents! They do not scare easily. We returned to our campsite to find a family of kangaroos had settled down there for a rest and a nap, and our presence did not deter them. There are plenty of bins all over the park so there is no reason not to use them.',
      price
    });
    await camp.save();
  } 
};

seedDB().then(() => {
mongoose.connection.close
});
