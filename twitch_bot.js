// Import tmi.js module
import tmi from 'tmi.js';
import axios from 'axios';  // Axios für HTTP-Anfragen
import { promises as fsPromises } from 'fs';

export class TwitchBot {
    constructor(bot_username, oauth_token, channels, elevenlabs_api_key, enable_tts) {
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
        this.elevenlabsApiKey = elevenlabs_api_key;  // API-Schlüssel für ElevenLabs
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

    // Angepasste Funktion für ElevenLabs TTS
    async sayTTS(channel, text, userstate) {
        // Check if TTS is enabled
        if (this.enable_tts !== 'true') {
            return;
        }

        try {
            // API-Endpunkt und Kopfzeilen für ElevenLabs TTS
            const url = 'https://api.elevenlabs.io/v1/text-to-speech';  // API-Endpunkt
            const voice = 'en_us_male';  // Beispielstimme, kann nach Bedarf geändert werden

            // API-Aufruf an ElevenLabs TTS
            const response = await axios.post(url, {
                text: text,
                voice: voice,
            }, {
                headers: {
                    'Authorization': `Bearer ${this.elevenlabsApiKey}`,
                    'Content-Type': 'application/json',
                },
                responseType: 'arraybuffer',  // Wir erwarten eine MP3-Datei
            });

            // Die Antwort (MP3-Datei) in ein Buffer konvertieren
            const buffer = Buffer.from(response.data);

            // Die MP3-Datei speichern
            const filePath = './public/file.mp3';
            await fsPromises.writeFile(filePath, buffer);

            // Rückgabe des Pfads zur gespeicherten Datei
            return filePath;
        } catch (error) {
            console.error('Fehler bei TTS-Anfrage an ElevenLabs:', error);
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
