export type userStatus = Array<'online' | 'idle' | 'dnd' | 'offline' | 'invisible' | undefined>

export type configType = {
    delay: {min: number, max: number}
    users: {min: number, max: number}
    guilds: {min: number, max: number}
    acceptedStatus: userStatus
    messages: Array<string>
    TOKENS: string[]
}
