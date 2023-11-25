import { User } from 'discord.js-selfbot-v13';
import { readFileSync, writeFileSync, existsSync } from 'fs';


class userDB
{
    Users: Array<userData>;
    constructor()
    {
        this.Users = new Array<userData>();
    }
}

class userData {
    userID: string | undefined
    username: string | undefined
}

class Database {
    private databasePath: string
    constructor() {
        this.databasePath = './USERS.json'
    }

    async getUserData():Promise<userDB> {
        if(!existsSync(this.databasePath)) writeFileSync(this.databasePath, `{\"Users\":[]}`) //creates empty object file
        return JSON.parse(readFileSync(this.databasePath).toString())
    }

    async checkUser(user: User):Promise<boolean> {
        var usersDB = await this.getUserData()
        if(usersDB.Users.find(member => member.userID == user.id) == undefined) {
            return false
        } else {
            return true
        }
    }

    async addUser(user: User) {
        var usersDB = await this.getUserData()
        var userInfo = new userData();

        userInfo.userID = user.id
        userInfo.username = `${user.username}#${user.discriminator}`

        usersDB.Users = usersDB.Users.concat(userInfo);

        writeFileSync(this.databasePath, JSON.stringify(usersDB))
    }
    
}

export const database = new Database();


