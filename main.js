const { Client, GatewayIntentBits, Events, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");

const { writeDataToExecel } = require("./writeExcel");

const { config } = require("dotenv");
config({ path: ".env" });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CLIENT_ID = process.env.CLIENT_ID;

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("interactionCreate", (interaction) => {
  if (interaction.isChatInputCommand()) {
    interaction.reply({ content: "Order received." });

    writeDataToExecel({
      food: interaction.options.get("food").value,
      drink: interaction.options.get("drink").value,
    });
  }
});

async function main() {
  const commands = [
    {
      name: "order",
      description: "order something",
      options: [
        {
          name: "food",
          description: "the type of food",
          type: 3,
          required: true,
        },
        {
          name: "drink",
          description: "the type of drink",
          type: 3,
          required: true,
          choiches: [
            {
              name: "Soda",
              value: "soda",
            },
            {
              name: "Juice",
              value: "juice",
            },
            {
              name: "Water",
              value: "water",
            },
          ],
        },
      ],
    },
  ];

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    client.login(TOKEN);
  } catch (err) {
    console.log(err);
  }
}

main();
