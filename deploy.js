const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const token = process.env.TOKEN;
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands("1476914257345122451", "1444329263699464275"),
            { body: commands }
        );
        console.log('Slash commands registered.');
    } catch (error) {
        console.error(error);
    }
})();