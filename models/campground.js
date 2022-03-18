const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: {type: Number, required:true},
    description: String,
    location: String
});


module.exports = mongoose.model("Campground", campgroundSchema);
