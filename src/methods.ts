import { Guild, User, GuildMember, GuildBasedChannel } from "discord.js-selfbot-v13";

import { client, randomElemArray } from "./index.js";
import { database } from "./database.js";
import { userStatus } from "./types.js";
import chalk from 'chalk';
// import axios from 'axios'

class Methods {

    private invalidChannels: string[];
    constructor() {
        this.invalidChannels = ['GUILD_CATEGORY']
    }

    getRandomGuilds(guildAmount: number) {
        var pickedGuilds = []
        let guilds: Array<Guild> = Array.from(client.guilds.cache.values());
    
        for (let i = 0; i < guildAmount; i++) { // grabs random discords from list
            var index = Math.floor(Math.random() * guilds.length)
            pickedGuilds.push(guilds[index])
            guilds.splice(index, 1)
        }
    
        return pickedGuilds
    }

    async getMembersFromGuilds(guilds: Array<Guild>, memberAmount: number, acceptedStatus: userStatus): Promise<User[]> {
    
        const membersPerGuild = Math.floor(memberAmount/guilds.length); 
        var remainder = memberAmount % guilds.length;       

        var users: User[] = []
    
        for(const guild of guilds) {
    
            var channelid: any = undefined // weird type here
            for (const [,channelData] of guild.channels.cache) { //loops through channels until it finds a valid one
                if(this.invalidChannels.includes(channelData.type)) continue
                channelid = channelData
                break
            }
            if(channelid == undefined) throw new Error("No valid guilds to get members!")
            
    
            // find a way to get more than 100 members
            await guild.members.fetchMemberList(channelid) 
    
            var newMembers: GuildMember[] = []

            // check if not already dm or not offline
            for (const [,member] of guild.members.cache) {
                // console.log(!await database.checkUser(member))
                if(acceptedStatus.includes(member.presence?.status) && !await database.checkUser(member.user)) newMembers.push(member)
            }
    
            if(newMembers.length == 0) throw new Error("Couldn't gather any new members!")
    
            for (let i = 0; i < membersPerGuild; i++) { // grabs random active users
                if(remainder != 0) { // includes remainders
                    i -= remainder
                    remainder = 0
                }
                var index = Math.floor(Math.random() * newMembers.length)
                users.push(newMembers[index].user)
                await database.addUser(newMembers[index].user)
                newMembers.splice(index, 1)
            }
    
            guild.members.cache.clear()
        }
    
        return users
    }

    massDM(users: Array<User>, messages: Array<string>){
        for(const user of users) {
            const msg = randomElemArray(messages)
            console.log(chalk.green(`Messaged ${user.username}#${user.discriminator} | ${msg}`))
            user.send(msg)
        }
    }

    // dont attempt to run this code, it automatically disables your discord account
    // maybe set a timeout so it mimics a person joining servers

    // async joinGuilds(guilds: string[]) {

    //     console.log(client.token)

    //     for (const guild of guilds) {
    //         //@ts-ignore
    //         const code = guild.match(/discord(?:app\.com\/invite|\.gg)\/([\w-]+)/)[1]

    //         const res = await axios.post(`https://discordapp.com/api/v6/invites/${code}`, '', {
    //             headers: {
    //                 'authorization': client.token
    //             }
    //         });

    //         console.log(res)
    //     }
    // }
}

export const methods = new Methods();