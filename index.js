const Discord = require('discord.js')
const token = process.env.TOKEN
// const applicationId = '860018716045213696'

const ready = ({client}) => _ => {
	console.log(`logged in as ${client.user.tag}!`)
}

const commands = {
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
