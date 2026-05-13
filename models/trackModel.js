const mongoose = require('mongoose');

const trackSchema = mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    food:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"foods",
        required:true
    },
    eatenDate:{
        type:String,
        default:new Date().toLocaleDateString(),
    },
    quantity:{
        type:Number,
        min:1,
        required:true
    }

},{timestamps:true})


let trackModel = mongoose.model("trackings",trackSchema);

module.exports = trackModel;


// {
//   "user":"693745fdf703d12b388d446e",
//   "food":"693b2a60d54887cb545691a5",
//   "quantity":200
// }

// {
//  "email":"shraffwalker@gmail.com",
//  "password":"Walker211"
// }


