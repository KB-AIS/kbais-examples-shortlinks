import { Telegraf } from 'telegraf';

const tgbotToken = process.env.SL_TGBOT_TOKEN;

if (!tgbotToken) {
    throw new Error('SL_TGBOT_TOKEN enviorment variable must be provided');
}

const bot = new Telegraf(tgbotToken);

bot.start((ctx) => {
    return ctx.reply('300 bucks');
});

bot.launch();

const onBotShutdown = (reason?: string) => {
    bot.stop(reason);
};

process.once('SIGINT', () => onBotShutdown('SIGINT'));

process.once('SIGTERM', () => onBotShutdown('SIGTERM'));