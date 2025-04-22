"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const { CHANNEL_ID_DISCORD, TOKEN_DISCORD } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged is as ${client.user.tag}`);
});

const token = TOKEN_DISCORD;
client.login(token);

client.on("messageCreate", (msg) => {
  {
    if (msg.author.bot) return;
    if (msg.content === "hello") {
      msg.reply(`Hello! How can i help u today?`);
    }
  }
});
