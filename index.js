import express from 'express';
import fs from 'fs';
import ws from 'ws';
import expressWs from 'express-ws';
import {job} from './keep_alive.js';
import {OpenAIOperations} from './openai_operations.js';
import {TwitchBot} from './twitch_bot.js';
import ftp from 'basic-ftp';

// Start keep alive cron job
job.start();
console.log(process.env);

// Setup express app
const app = express();
const expressWsInstance = expressWs(app);

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Load environment variables
const GPT_MODE = process.env.GPT_MODE || 'CHAT';
const HISTORY_LENGTH = process.env.HISTORY_LENGTH || 5;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const MODEL_NAME = process.env.MODEL_NAME || 'gpt-3.5-turbo';
const TWITCH_USER = process.env.TWITCH_USER || 'oSetinhasBot';
const TWITCH_AUTH = process.env.TWITCH_AUTH || 'oauth:vgvx55j6qzz1lkt3cwggxki1lv53c2';
const COMMAND_NAME = process.env.COMMAND_NAME || '!gpt';
const CHANNELS = process.env.CHANNELS || 'oSetinhas,jones88';
const SEND_USERNAME = process.env.SEND_USERNAME || 'true';
const ENABLE_TTS = process.env.ENABLE_TTS || 'false';
const ENABLE_CHANNEL_POINTS = process.env.ENABLE_CHANNEL_POINTS || 'false';
const COOLDOWN_DURATION = parseInt(process.env.COOLDOWN_DURATION, 10) || 10; // Cooldown duration in seconds

// FTP server credentials
const FTP_HOST = process.env.FTP_HOST || 'theagentbeard.de';
const FTP_USER = process.env.FTP_USER || 'f016fdcf';
const FTP_PASS = process.env.FTP_PASS || 'xysxxi2ztiBsHHYKkWfh';
const FTP_PATH = process.env.FTP_PATH || '/response.txt';  // FTP file path

if (!OPENAI_API_KEY) {
    console.error('No OPENAI_API_KEY found. Please set it as an environment variable.');
}

const commandNames = COMMAND_NAME.split(',').map(cmd => cmd.trim().toLowerCase());
const channels = CHANNELS.split(',').map(channel => channel.trim());
const maxLength = 399;
let fileContext = 'You are a helpful Twitch Chatbot.';
let lastUserMessage = '';
let lastResponseTime = 0; // Track the last response time

// Setup Twitch bot
console.log('Channels: ', channels);
const bot = new TwitchBot(TWITCH_USER, TWITCH_AUTH, channels, OPENAI_API_KEY, ENABLE_TTS);

// Setup OpenAI operations
fileContext = fs.readFileSync('./file_context.txt', 'utf8');
const openaiOps = new OpenAIOperations(fileContext, OPENAI_API_KEY, MODEL_NAME, HISTORY_LENGTH);

// Setup Twitch bot callbacks
bot.onConnected((addr, port) => {
    console.log(`* Connected to ${addr}:${port}`);
    channels.forEach(channel => {
        console.log(`* Joining ${channel}`);
        console.log(`* Saying hello in ${channel}`);
    });
});

bot.onDisconnected(reason => {
    console.log(`Disconnected: ${reason}`);
});

// Connect bot
bot.connect(
    () => {
        console.log('Bot connected!');
    },
    error => {
        console.error('Bot couldn\'t connect!', error);
    }
);

bot.onMessage(async (channel, user, message, self) => {
    if (self) return;

    const currentTime = Date.now();
    const elapsedTime = (currentTime - lastResponseTime) / 1000; // Time in seconds

    if (ENABLE_CHANNEL_POINTS === 'true' && user['custom-reward-id'] === '390a4985-1428-49b7-952f-03637defe0ab') {
        console.log(`Highlighted message: ${message}`);
        if (elapsedTime < COOLDOWN_DURATION) {
            bot.say(channel, `Cooldown active. Please wait ${COOLDOWN_DURATION - elapsedTime.toFixed(1)} seconds before sending another message.`);
            return;
        }
        lastResponseTime = currentTime; // Update the last response time

        const response = await openaiOps.make_openai_call(message);
        bot.say(channel, response);
        await uploadResponseToFTP(response);  // Upload to FTP

    }

    const command = commandNames.find(cmd => message.toLowerCase().startsWith(cmd));
    if (command) {
        if (elapsedTime < COOLDOWN_DURATION) {
            bot.say(channel, `Cooldown active. Please wait ${COOLDOWN_DURATION - elapsedTime.toFixed(1)} seconds before sending another message.`);
            return;
        }
        lastResponseTime = currentTime; // Update the last response time

        let text = message.slice(command.length).trim();
        if (SEND_USERNAME === 'true') {
            text = `Message from user ${user.username}: ${text}`;
        }

        const response = await openaiOps.make_openai_call(text);
        if (response.length > maxLength) {
            const messages = response.match(new RegExp(`.{1,${maxLength}}`, 'g'));
            messages.forEach((msg, index) => {
                setTimeout(() => {
                    bot.say(channel, msg);
                }, 1000 * index);
            });
        } else {
            bot.say(channel, response);
        }

        if (ENABLE_TTS === 'true') {
            try {
                const ttsAudioUrl = await bot.sayTTS(channel, response, user['userstate']);
                notifyFileChange(ttsAudioUrl);
            } catch (error) {
                console.error('TTS Error:', error);
            }
        }

        await uploadResponseToFTP(response);  // Upload to FTP
    }
});


// Funktion zum Hochladen der Antwort als Textdatei
async function uploadResponseToFTP(response) {
    const client = new ftp.Client();
    try {
        // Stelle eine Verbindung zum FTP-Server her
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
        });

        // Wandelt die Antwort in einen Buffer um
        const buffer = Buffer.from(response, 'utf-8');  // Text in Buffer umwandeln

        // Lade die Antwort als .txt-Datei auf den FTP-Server hoch
        await client.uploadFrom(buffer, './file.txt');  // Zielpfad auf dem Server angeben

        console.log('Antwort erfolgreich auf den FTP-Server hochgeladen.');
    } catch (err) {
        console.error('Fehler beim Hochladen auf den FTP-Server:', err);
    } finally {
        client.close();
    }
}

// Beispielaufruf der Funktion
const responseText = 'Dies ist eine Antwort, die hochgeladen werden soll.';
uploadResponseToFTP(responseText);

const port = process.env.PORT || 3000;  // Nutze den Port von Render oder 3000 lokal

const server = app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});

// Remaining code (WebSocket, Express setup, etc.)
