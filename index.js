const { Client, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const token = process.env.TOKEN;

client.commands = {};
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands[command.data.name] = command;
}

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

const ferrari = ["must be the water", "we are checking", "kono normal manush ei team ke support korbena", "Ferrari Ferrari Ferrari Ferrari Ferrari", "i am ready to be hurt again", "amar mone hoye amar ektu beriye gelo"]

const max = ["chor sala", "MAX MAX MAX SUPER MAX MAX SUPER SUPER MAX MAX MAX SUPER MAX MAX SUPER SUPER MAX", "DU DU DU DU Max Verstappen", "DU DU DU DU FUCK VERSTAPPEN", "redbull gives you wings"]

const lando = ["oscar > lando", "lando > oscar", "papaya rules", "amar ek bhalo bondhu mclaren fan tai or girlfriend er sathe ami sex kori karon papaya rules", "pls crash lando", "oscar will bottle this"]

const stroll = ["fernando sigmalonso is the boss", "chad", "daddy stroll power", "allah hu akbar", "i hate you as much as george hates max", "i want carlos to peg me while my gf watches", "damn"]

const list = ["tui halka paglachoda naki re bhai", "gaar mereche", "sex sex sex sex sex", "kutta naki sala", "tor theke boro udhgandu dekhini re bhai", "amar mone hoye amar ektu beriye gelo", "ole babale", "tor baaper chakor noi bara", "ami ghumabo", "hatt bara"]


client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;
    if (!message.mentions.has(client.user)) return;
    let cleaned = message.content
        .replace(/<@!?(\d+)>/g, "")
        .trim();
    cleaned = cleaned.toLowerCase();
    resp(cleaned, message);
})

function resp(input, rep) {
    if (input.includes("ferrari") || input.includes("leclerc") || input.includes("hamilton") || input.includes("lewis") || input.includes("charles") || input.includes("leclu")) {
        const len = ferrari.length;
        const index = Math.floor(Math.random() * len)
        rep.reply(ferrari[index]);
    }
    else if (input.includes("max") || input.includes("red bull") || input.includes("verstappen")) {
        const len = max.length;
        const index = Math.floor(Math.random() * len)
        rep.reply(max[index]);
    }
    else if (input.includes("lando") || input.includes("mclaren") || input.includes("oscar") || input.includes("piastri") || input.includes("norris") || input.includes("mcl") || input.includes("mclearn")) {
        const len = lando.length;
        const index = Math.floor(Math.random() * len)
        rep.reply(lando[index]);
    }
    else if (input.includes("george") || input.includes("russell") || input.includes("antonelli") || input.includes("kimi") || input.includes("stroll") || input.includes("alonso") || input.includes("sainz")) {
        const len = stroll.length;
        const index = Math.floor(Math.random() * len)
        rep.reply(stroll[index]);
    }
    else {
        const len = list.length;
        const index = Math.floor(Math.random() * len)
        rep.reply(list[index]);
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands[interaction.commandName];
    if (!command) return;

    await command.execute(interaction);
});

client.login(token);