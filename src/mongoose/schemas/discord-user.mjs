import mongoose from "mongoose";

const DiscordUserSchema = new mongoose.Schema({
    discordId: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    username: {
        type: mongoose.Schema.Types.String,
        required:true,
        unique:true,
    }
})

export const DiscordUser = new mongoose.model("DiscordUser", DiscordUserSchema)