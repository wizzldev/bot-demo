import { Client } from "wizzl.js";
import ping from 'ping'

const client = new Client({domain: 'api.wizzl.app'})

client.onReady(() => console.log('Bot is Ready!'))

const prefix = '!'

client.onMessage(async (ctx) => {
    const message = ctx.message.withPrefix(prefix, true)
    if(!message) return

    const args = message.split(' ')
    const cmd = args.shift()
    if(!cmd) return

    switch (cmd) {
        case 'react': {
            ctx.message.react('🚀')
            break
        }
        case 'ping': {
            if(args.length !== 1) break
            ctx.message.reply.text(`Pinging ${args[0]}... 🏓`)
            await pingSite(args[0], ctx)
            break
        }
        case 'search': {
            if(args.length < 2) break
            const engine = args.shift()
            search(engine, args.join('+'), ctx)
        }
    }
})

const pingSite = async (host, ctx) => {
    const res = await ping.promise.probe(host, undefined)
    if(res.alive) {
        ctx.resource.send('Host is alive! 🏓')
    } else ctx.resource.send('Host is unreachable 🪦')
}

const search = (engine, text, ctx) => {
    let url = 'https://'
    switch (engine) {
        case 'google': {
            url += 'google.com/search?q='
            break
        }
        case 'youtube':
            url += 'www.youtube.com/results?search_query='
            break
        case 'stackoverflow':
            url += 'stackoverflow.com/search?q='
            break
        default:
            ctx.resource.send(`Invalid search engine. Use ${prefix}search [engine: google|youtube|stackoverflow] [text: a string to search]`)
            return
    }

    url += text
    ctx.resource.send(`Click the link for the search results: ${url} 🧭`)
}

await client.connect('<token>')