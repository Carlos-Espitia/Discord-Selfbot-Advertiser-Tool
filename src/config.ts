import { configType } from "./types.js";

export const config: configType = {
    delay: {min: 5000, max: 10000}, // wait time before sending DMs | milliseconds
    users: {min: 1, max: 3}, // amount of users to DM
    guilds: {min: 1, max: 1}, // amount of guilds that will be used to get nembers from, divides the set amount of users to dm per guild 
    acceptedStatus: ['online', 'idle', 'dnd', 'offline', 'invisible'], // only grabs members with this current status
    messages: [
        `Whats up`,
        `Yo`,
        `Hey`
    ], // messages that the bot will randomly pick to send to the user
    TOKENS: ['ODk5MzkwNjY4MjgyMTM4Njc0.GrhtzF.tMGykLjnfIyV0pwtbvRSlnpJTc4el2O3Cbr4DY'] // Add account tokens here, this is an example token, A test account I made
}