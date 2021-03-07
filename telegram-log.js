import TelegramBot from "node-telegram-bot-api";
import logger from "./logger.js";
import dotenv from "dotenv";
dotenv.config({
  path: "/Users/medha/projects/twitter-declassify/.env.local"
});

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

const logToTelegram = message => {
  return bot.sendMessage(
    process.env.TELEGRAM_LOGS_CHANNEL,
    JSON.stringify(message)
  );
};

export default logToTelegram;
