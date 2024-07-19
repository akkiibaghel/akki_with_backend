import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        subscriber: {
            type: mongoose.Schema.Types.ObjectId, //one who is subscribing
            ref: "User"
        },
        channel: {
            type: mongoose.Schema.Types.ObjectId, // one to who subscriber is subscrib the channel
            ref: "User"
        }
    } ,
    {timestamps: true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)