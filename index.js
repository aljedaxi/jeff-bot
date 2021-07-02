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
		.then(r => r.ok ? r.json ().then(pipe ([prop ('results'), Just])) : Promise.resolve (Nothing))

const ready = ({client}) => _ => {
	console.log(`logged in as ${client.user.tag}!`)
}

const compose = f => g => x => f (g (x))
const send = message => s => message.channel.send (s)
const getGifUrl = prop ('itemurl')
const commands = {
	'jeff me': ({client, message}) => getJeffGif ().then(maybe => 
		isJust (maybe) 
			? compose (send (message)) (map (getGifUrl)) (maybe.value)
			: Promise.reject ()
	),
	jeff: ({client, message}) => message.channel.send ('@everyone my name jeff')
}

const message = ({client}) => message => {
	if (message.author.bot) return
	Object.entries(commands).some(([k,v]) => {
		new RegExp (k, 'ig').test(message.content) && v ({client, message})
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
