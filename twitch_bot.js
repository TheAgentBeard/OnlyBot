// Import tmi.js und axios für HTTP-Anfragen
import tmi from 'tmi.js';
import axios from 'axios'; // Hier verwenden wir axios für HTTP-Anfragen
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
        this.elevenlabsApiKey = elevenlabs_api_key;
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
        // Check if TTS is enabled
        if (this.enable_tts !== 'true') {
            return;
        }
        
        try {
            // Anfrage an die ElevenLabs TTS-API
            const response = await axios.post(
                'https://api.elevenlabs.io/v1/text-to-speech/generate', 
                {
                    voiceId: 'CwhRBWXzGAHq8TQ4Fs17', // Beispiel-Stimme, du kannst hier eine andere auswählen
                    text: text
                }, 
                {
                    headers: {
                        'Authorization': `Bearer ${this.elevenlabsApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer' // Wir erwarten eine Audiodatei im Arraybuffer-Format
                }
            );

            // Speichern der Audiodatei als MP3
            const buffer = Buffer.from(response.data);
            const filePath = './public/file.mp3';
            await fsPromises.writeFile(filePath, buffer);

            // Gebe den Dateipfad der gespeicherten Audiodatei zurück
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
