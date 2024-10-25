import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({

  videoFile:{
    type: String, //cloundinary;
    required: true,
  },
  videoTitle:{
    type: String, //cloundinary;
    required: true,
  },
  description:{
    type: String, //cloundinary;
    required: true,
  },
  duration:{
    type: Number, //cloundinary;
    required: true,
  },
  views:{
    tupe:Number,
    default:0
  },
  isPublished:{
    default:true
  },
  owner:{
    type:Schema.ObjectId,
    ref:"User"
  }
  



},{
  timestamps:true

})

videoSchema.plugin(mongooseAggregatePaginate)



export const Video = mongoose.model("Video",videoSchema)