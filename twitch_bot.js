// Import tmi.js module
import tmi from 'tmi.js';
import axios from 'axios';
import { promises as fsPromises } from 'fs';

export class TwitchBot {
    constructor(bot_username, oauth_token, channels, openai_api_key, elevenlabs_api_key, voice_id, enable_tts) {
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
        this.elevenlabs_api_key = elevenlabs_api_key;
        this.voice_id = voice_id;  // Die VoiceID für ElevenLabs TTS
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
            // API-Aufruf an ElevenLabs TTS
            const response = await axios.post('https://api.elevenlabs.io/v1/text-to-speech', {
                voice_id: this.voice_id,   // Verwende die VoiceID von ElevenLabs
                text: text,
                model_id: "elevenlabs-v1"  // Beispielmodell, könnte je nach den Anforderungen variieren
            }, {
                headers: {
                    'Authorization': `Bearer ${this.elevenlabs_api_key}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer' // Erhalte Audio als ArrayBuffer
            });

            // Speichere das erhaltene Audio als MP3
            const audioBuffer = Buffer.from(response.data);
            const filePath = './public/file.mp3';
            await fsPromises.writeFile(filePath, audioBuffer);

            // Gibt den Pfad der MP3-Datei zurück
            return filePath;
        } catch (error) {
            console.error('Fehler beim Abrufen der TTS-Audio-Datei:', error);
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
