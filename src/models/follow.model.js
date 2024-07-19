import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    },
    {timestamps: true})

export const Follow = mongoose.model("Follow", followSchema)
