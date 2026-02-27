const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('f1')
        .setDescription('F1 commands')
        .addSubcommandGroup(group =>
            group
                .setName('standings')
                .setDescription('drivers championship standings')
                .addSubcommand(sub =>
                    sub.setName('wdc')
                        .setDescription('driver standings')
                )
                .addSubcommand(sub =>
                    sub.setName('wcc')
                        .setDescription('constructor standings')
                )
                .addSubcommand(sub =>
                    sub.setName('driver')
                        .setDescription('driver position in standings')
                        .addStringOption(opt =>
                            opt
                                .setName('name')
                                .setDescription('driver name')
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub.setName('team')
                        .setDescription('team position in standings...forza ferrari')
                        .addStringOption(opt =>
                            opt
                                .setName('name')
                                .setDescription('team name')
                                .setRequired(true)
                        )
                )
        )
        .addSubcommand(sub =>
                    sub.setName('upcoming')
                        .setDescription('info about upcoming race weekend')
                ),

    async execute(interaction) {

        await interaction.deferReply();

        const sub = interaction.options.getSubcommand();

        let url;

        if (sub === "wdc" || sub === "driver") {
            url = "https://api.jolpi.ca/ergast/f1/2025/driverStandings.json";
        }

        if (sub === "wcc" || sub === "team") {
            url = "https://api.jolpi.ca/ergast/f1/2025/constructorStandings.json";
        }

        if(sub==="upcoming") {
            url= "https://api.jolpi.ca/ergast/f1/current/next.json"
        }
        const response = await fetch(url);
        const data = await response.json();

        let message = "\n**  SEASON 2025**\n\n";

        if (sub === "wdc") {

            const standings =
                data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

            standings.slice(0, 20).forEach(d => {
                message += `${d.position}. ${d.Driver.familyName} — ${d.points} pts\n`;
            });
        }
        if (sub === "wcc") {

            const standings =
                data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

            standings.slice(0, 10).forEach(c => {
                message += `${c.position}. ${c.Constructor.name} — ${c.points} pts\n`;
            });
        }
        if (sub == "driver") {
            const standings =
                data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

            const name = interaction.options.getString("name").toLowerCase();

            const index = standings.findIndex(d =>
                d.Driver.familyName.toLowerCase().includes(name)
            );

            if (index === -1) {
                message = "Driver not found";
            } else {

                const driver = standings[index];

                const leaderPoints = parseInt(standings[0].points);
                const driverPoints = parseInt(driver.points);

                const gapToLeader = leaderPoints - driverPoints;

                let gapToFront = null;

                if (index > 0) {
                    const frontPoints = parseInt(standings[index - 1].points);
                    gapToFront = frontPoints - driverPoints;
                }

                message +=
                    `${driver.Driver.givenName} ${driver.Driver.familyName} is P${driver.position} ${driver.points} points. \nGap to leader: ${gapToLeader} points \nGap to car ahead: ${gapToFront ?? "0"} points`;
            }
        }
        if (sub == "team") {
            const standings =
                data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
            const name = interaction.options.getString("name").toLowerCase();
            const index = standings.findIndex(c =>
                c.Constructor.name.toLowerCase().includes(name)
            );
            if (index === -1) {
                message = "Team not found";
            } else {
                const team = standings[index];
                const leaderPoints = parseInt(standings[0].points);
                const teamPoints = parseInt(team.points);
                const gapToLeader = leaderPoints - teamPoints;
                let gapToFront = null;
                if (index > 0) {
                    const frontPoints = parseInt(standings[index - 1].points);
                    gapToFront = frontPoints - teamPoints;
                }
                message +=
                    `${team.Constructor.name} is P${team.position} with ${team.points} points \n Gap to leader: ${gapToLeader} points\n Gap to team ahead: ${gapToFront ?? "0"} points`;
            }
        }
        if (sub === "upcoming") {
            const race = data.MRData.RaceTable.Races[0];

            const raceName = race.raceName;
            const circuit = race.Circuit.circuitName;

            const raceTime = new Date(`${race.date}T${race.time}`);
            const raceUnix = Math.floor(raceTime.getTime() / 1000);

            const qualiTime = new Date(`${race.Qualifying.date}T${race.Qualifying.time}`);
            const qualiUnix = Math.floor(qualiTime.getTime() / 1000);

            message =
                `Next Race: ${raceName}\nCircuit: ${circuit}\nQualifying: <t:${qualiUnix}:F>\nRace: <t:${raceUnix}:F>\n`;
        }
        await interaction.editReply(message);
    }
};