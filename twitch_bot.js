import tmi from 'tmi.js';
import OpenAI from 'openai';
import axios from 'axios';
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
        this.openai = new OpenAI({ apiKey: openai_api_key });
        this.enable_tts = enable_tts;
        this.elevenlabsApiKey = "sk_5a7d1e99d43df9ba5247ddd33f55d464eac838df6d4705f3"; // Dein Eleven Labs API-Schlüssel
        this.voiceId = "CwhRBWXzGAHq8TQ4Fs17"; // Die Voice-ID deiner benutzerdefinierten Stimme
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
        // Check if TTS is enabled
        if (this.enable_tts !== 'true') {
            return;
        }
        try {
            // API-Anfrage an Eleven Labs für Text-to-Speech
            const url = 'https://api.elevenlabs.io/v1/text-to-speech'; // Eleven Labs TTS Endpunkt

            const requestData = {
                text: text,
                voice_id: this.voiceId,  // Deine benutzerdefinierte Voice-ID
                voice_settings: {
                    stability: 0.75,  // Anpassbare Parameter für die Stimme
                    similarity: 0.75, // Anpassbare Parameter für die Stimme
                },
            };

            // API-Anfrage senden
            const response = await axios.post(url, requestData, {
                headers: {
                    'Authorization': `Bearer ${this.elevenlabsApiKey}`,
                    'Content-Type': 'application/json',
                },
                responseType: 'arraybuffer', // Audio wird als ArrayBuffer zurückgegeben
            });

            // Antwort-Daten als Audio speichern
            const audioBuffer = response.data;

            // Speichern der Audiodatei im MP3-Format
            const filePath = './public/file.mp3';
            await fsPromises.writeFile(filePath, audioBuffer);

            // Rückgabe des Pfads zur gespeicherten Datei
            return filePath;
        } catch (error) {
            console.error('Fehler bei der TTS-Anfrage an Eleven Labs:', error);
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
