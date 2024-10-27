import { channel } from "diagnostics_channel";
import mongoose , {Schema} from "mongoose";

const subscriptionSchema = new Schema({
  subscriber:{
    type: Schema.Types.ObjectId,   // one who is subscribing 
    ref: 'User',
    required: true

  },
  channel : {
    type: Schema.Types.ObjectId,   // channel being subscribed to
    ref: 'User'
  }
},{
  timestamps: true
})



const Subscription = mongoose.model("subscription",subscriptionSchema)