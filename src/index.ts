import { Client, Guild, GuildMember } from 'discord.js-selfbot-v13'
import { config } from './config.js';
import { methods } from './methods.js';
import chalk from 'chalk';
import inquirer from 'inquirer';

export const client = new Client({
    checkUpdate: false,
});
// docs
// https://discordjs-self-v13.netlify.app/#/

// TODO:
// future errors that may cause are getting DM limited by discord | detect that to add a longer delay
// add feature that records number of joins | could be detected by giving perms to the user to view invite link information OR detect the user click on the invite link 
// add a feature that asks the user if they would like to join the discord first before actually sending the link, send link after a positive response | this makes it seem less like botted dms

async function start() {
    console.clear();
    console.log(chalk.yellow(`\nThis tool is used for automating advertisements with selfbots on discord.\n`));
    const token = await inquirer.prompt({
        name: `selected`,
        type:  `list`,
        message: chalk.blue(`Choose a token/bot to run\n`),
        choices: config.TOKENS,
    })
    console.clear();

    client.login(token.selected);
}

client.on('ready', async () => {
    console.log(chalk.magenta(
    `
    --------------------
    Logged in as
    User: ${client.user?.username}#${client.user?.discriminator}
    ID: ${client.user?.id}
    --------------------
    `
    ))
    logic()
})

async function logic() {
    //checks
    if(config.guilds.min > client.guilds.cache.size || config.guilds.max > client.guilds.cache.size) throw new Error("Guild settings are not suitable for this account\nYou have to adjust guild settings!\nThis could be caused by the bot being kicked/banned from servers during run time or the settings you input were not suitable for the bot!\n")
    const guildNum = range(config.guilds.min, config.guilds.max)
    var memberNum = null
    if(guildNum > config.users.min) {memberNum = range(guildNum,config.users.max)} else {memberNum = range(config.users.min, config.users.max)}
    //checks

    console.log(chalk.yellow(`\nGathering Guilds and Users...\n`))
    
    const guilds = methods.getRandomGuilds(guildNum)
    var users = []
    
    try {
        users = await methods.getMembersFromGuilds(guilds, memberNum, config.acceptedStatus)
        var delay = range(config.delay.min, config.delay.max)
        methods.massDM(users, config.messages)
        await sleep(delay)
        
    } catch (err) {
        console.log(`\n${err}`)
        console.log(`\nRetrying...\n`)
    }

    logic()
}


// utils | create a class for utils later 
function sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function range(min: number, max: number) {  
    return Math.floor(Math.random() * (max - min) + min) 
}

export function randomElemArray(array: Array<any>) {  
    return array[Math.floor(Math.random() * array.length)]
}
  
await start()



// use this code to grab token of the account
// code to get token by inspect console
// window.webpackChunkdiscord_app.push([
//     [Math.random()],
//     {},
//     req => {
//       for (const m of Object.keys(req.c)
//         .map(x => req.c[x].exports)
//         .filter(x => x)) {
//         if (m.default && m.default.getToken !== undefined) {
//           return copy(m.default.getToken());
//         }
//         if (m.getToken !== undefined) {
//           return copy(m.getToken());
//         }
//       }
//     },
//   ]);
//   console.log('%cWorked!', 'font-size: 50px');
//   console.log(`%cYou now have your token in the clipboard!`, 'font-size: 16px');
