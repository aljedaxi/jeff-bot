const Discord = require ('discord.js')
const fetch = require ('node-fetch')
const {
	Nothing,
	Just,
	pipe,
	prop,
	map,
	isJust,
} = require ('sanctuary')
const {TOKEN: token, TENOR_TOKEN: tenorToken} = process.env
// const applicationId = '860018716045213696'

const queries = {
	q: 'my name is jeff',
	key: tenorToken,
	limit: 1,
	contentfilter: 'off',
}
const qString = Object.entries(queries).map(([k, v]) => `${k}=${v}`).join('&')
const getJeffGif = _ =>
	fetch (`https://g.tenor.com/v1/search?${qString}`)
		.then(r => r.ok 
			? r.json ().then(pipe ([prop ('results')])) 
			: r.json ().then(o => Promise.reject (o))
		)

const ready = ({client}) => _ => {
	console.log(`logged in as ${client.user.tag}!`)
}

const compose = f => g => x => f (g (x))
const send = message => s => message.channel.send (s)
const getGifUrl = prop ('itemurl')
const commands = {
	'my name jeff': ({message}) => message.channel.send ('no, MY name jeff'),
	'jeff me': ({client, message}) => getJeffGif ()
		.then(compose (send (message)) (map (getGifUrl))),
	jeff: ({client, message}) => message.channel.send ('@everyone my name jeff')
}

const pressF = sender => o => sender (`something went wrong: ${JSON.stringify (o)}`)

const message = ({client}) => message => {
	if (message.author.bot) return
	Object.entries(commands).some(([k,v]) => {
		if (new RegExp (k, 'ig').test(message.content)) {
			v ({client, message}).catch(pressF (send (message)))
			return true
		}
	})
}

const ons = {ready, message}

const main = _ => {
	const client = new Discord.Client ()
	Object.entries(ons).forEach(([k,v]) => {
		client.on(k, v ({client}))
	})
	client.login(token)
}

main ()
