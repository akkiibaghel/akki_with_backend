import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        subscriber: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        subscriber: {
            type: mongoose.Schema.Types.ObjectId, //one who is subscribing
            ref: "user"
        },
        channel: {
            type: mongoose.Schema.Types.ObjectId, // one to who subscriber is subscrib the channel
            ref: "user"
        }
    } ,
    {timestamps: true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)