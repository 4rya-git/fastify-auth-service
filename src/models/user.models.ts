import { Schema, model } from "mongoose";

const user_schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        refresh_token: { type: String, default: null },
    },
    { timestamps: true }
);

export const User = model("User", user_schema);
