// Import tmi.js module
import tmi from 'tmi.js';
import OpenAI from 'openai';
import { promises as fsPromises } from 'fs';

export class TwitchBot {
    constructor(bot_username, oauth_token, channels, openai_api_key, enable_tts) {
        this.channels = channels;
        this.client = new tmi.client({
            connection: {
                reconnect: true,
                secure: true
            },
            identity: {
                username: bot_username,
                password: oauth_token
            },
            channels: this.channels
        });
        this.openai = new OpenAI({apiKey: openai_api_key});
        this.enable_tts = enable_tts;
    }

    addChannel(channel) {
        // Check if channel is already in the list
        if (!this.channels.includes(channel)) {
            this.channels.push(channel);
            // Use join method to join a channel instead of modifying the channels property directly
            this.client.join(channel);
        }
    }

    connect() {
        // Use async/await syntax to handle promises
        (async () => {
            try {
                // Await for the connection to be established
                await this.client.connect();
            } catch (error) {
                // Handle any errors that may occur
                console.error(error);
            }
        })();
    }

    disconnect() {
        // Use async/await syntax to handle promises
        (async () => {
            try {
                // Await for the connection to be closed
                await this.client.disconnect();
            } catch (error) {
                // Handle any errors that may occur
                console.error(error);
            }
        })();
    }

    onMessage(callback) {
        this.client.on('message', callback);
    }

    onConnected(callback) {
        this.client.on('connected', callback);
    }

    onDisconnected(callback) {
        this.client.on('disconnected', callback);
    }

    say(channel, message) {
        // Use async/await syntax to handle promises
        (async () => {
            try {
                // Await for the message to be sent
                await this.client.say(channel, message);
            } catch (error) {
                // Handle any errors that may occur
                console.error(error);
            }
        })();
    }

const axios = require('axios');
const fs = require('fs').promises;

async function sayTTS(channel, text, userstate) {
    // Check if TTS is enabled
    if (this.enable_tts !== 'true') {
        return;
    }
    
    try {
        // Set up the request payload
        const apiKey = 'sk_5a7d1e99d43df9ba5247ddd33f55d464eac838df6d4705f3';  // Ersetze mit deinem API-Schlüssel
        const url = 'https://api.elevenlabs.io/v1/text-to-speech';  // API-Endpunkt von ElevenLabs
        const voice = 'en_us_male';  // Beispiel für eine männliche Stimme, kann angepasst werden

        const response = await axios.post(url, {
            text: text,
            voice: voice,
            apiKey: apiKey,  // Authentifizierung via API-Schlüssel
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer',  // Wir erwarten eine Binärantwort (MP3)
        });

        // Convert the received buffer to an MP3 file
        const buffer = Buffer.from(response.data);

        // Save the buffer as an MP3 file
        const filePath = './public/file.mp3';
        await fs.writeFile(filePath, buffer);

        // Return the path of the saved audio file
        return filePath;

    } catch (error) {
        console.error('Error in sayTTS:', error);
    }
}

    whisper(username, message) {
        // Use async/await syntax to handle promises
        (async () => {
            try {
                // Await for the message to be sent
                await this.client.whisper(username, message);
            } catch (error) {
                // Handle any errors that may occur
                console.error(error);
            }
        })();
    }

    ban(channel, username, reason) {
        // Use async/await syntax to handle promises
        (async () => {
            try {
                // Await for the user to be banned
                await this.client.ban(channel, username, reason);
            } catch (error) {
                // Handle any errors that may occur
                console.error(error);
            }
        })();
    }

    unban(channel, username) {
        // Use async/await syntax to handle promises
        (async () => {
            try {
                // Await for the user to be unbanned
                await this.client.unban(channel, username);
            } catch (error) {
                // Handle any errors that may occur
                console.error(error);
            }
        })();
    }

    clear(channel) {
        // Use async/await syntax to handle promises
        (async () => {
            try {
                // Await for the chat to be cleared
                await this.client.clear(channel);
            } catch (error) {
                // Handle any errors that may occur
                console.error(error);
            }
        })();
    }

    color(channel, color) {
        // Use async/await syntax to handle promises
        (async () => {
            try {
                // Await for the color to be changed
                await this.client.color(channel, color);
            } catch (error) {
                // Handle any errors that may occur
                console.error(error);
            }
        })();
    }

    commercial(channel, seconds) {
        // Use async/await syntax to handle promises
        (async () => {
            try {
                // Await for the commercial to be played
                await this.client.commercial(channel, seconds);
            } catch (error) {
                // Handle any errors that may occur
                console.error(error);
            }
        })();
    }
}
