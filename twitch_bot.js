import tmi from 'tmi.js';
import OpenAI from 'openai';
import axios from 'axios';
import { promises as fsPromises } from 'fs';

export class TwitchBot {
    constructor(bot_username, oauth_token, channels, enable_tts) {
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
        this.elevenlabsApiKey = "sk_5a7d1e99d43df9ba5247ddd33f55d464eac838df6d4705f3";
        this.enable_tts = enable_tts;
    }

    addChannel(channel) {
        if (!this.channels.includes(channel)) {
            this.channels.push(channel);
            this.client.join(channel);
        }
    }

    connect() {
        (async () => {
            try {
                await this.client.connect();
            } catch (error) {
                console.error(error);
            }
        })();
    }

    disconnect() {
        (async () => {
            try {
                await this.client.disconnect();
            } catch (error) {
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
        (async () => {
            try {
                await this.client.say(channel, message);
            } catch (error) {
                console.error(error);
            }
        })();
    }

    async sayTTS(channel, text, userstate) {
        if (this.enable_tts !== 'true') {
            return;
        }

        try {
            // Call ElevenLabs API to generate speech from text
            const response = await axios.post('https://api.elevenlabs.io/v1/text-to-speech', {
                text: text,
                voice: 'en_us_male', // Use a specific voice or allow it to be dynamic
                apiKey: this.elevenlabsApiKey
            }, {
                headers: {
                    'Authorization': `Bearer ${this.elevenlabsApiKey}`
                },
                responseType: 'arraybuffer'
            });

            // Save the audio file as an MP3
            const filePath = './public/file.mp3';
            await fsPromises.writeFile(filePath, Buffer.from(response.data));

            // Return the path to the saved file
            return filePath;
        } catch (error) {
            console.error('Error in sayTTS:', error);
        }
    }

    whisper(username, message) {
        (async () => {
            try {
                await this.client.whisper(username, message);
            } catch (error) {
                console.error(error);
            }
        })();
    }

    ban(channel, username, reason) {
        (async () => {
            try {
                await this.client.ban(channel, username, reason);
            } catch (error) {
                console.error(error);
            }
        })();
    }

    unban(channel, username) {
        (async () => {
            try {
                await this.client.unban(channel, username);
            } catch (error) {
                console.error(error);
            }
        })();
    }

    clear(channel) {
        (async () => {
            try {
                await this.client.clear(channel);
            } catch (error) {
                console.error(error);
            }
        })();
    }

    color(channel, color) {
        (async () => {
            try {
                await this.client.color(channel, color);
            } catch (error) {
                console.error(error);
            }
        })();
    }

    commercial(channel, seconds) {
        (async () => {
            try {
                await this.client.commercial(channel, seconds);
            } catch (error) {
                console.error(error);
            }
        })();
    }
}
