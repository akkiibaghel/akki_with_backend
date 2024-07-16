import mongoose from "mongoose";
import { type } from "os";

const likeSchema = new mongoose.Schema(
    {
        chennal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },

    },
    {timestamps: true})


export const Like = mongoose.model("Like" , likeSchema)