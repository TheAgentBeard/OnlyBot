// Import tmi.js module
import tmi from 'tmi.js';
import axios from 'axios';  // Importiere Axios für HTTP-Anfragen
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
        this.enable_tts = enable_tts;
        this.elevenLabsApiKey = 'sk_5a7d1e99d43df9ba5247ddd33f55d464eac838df6d4705f3'; // Deine Elevenlabs API-Schlüssel
        this.voiceId = 'CwhRBWXzGAHq8TQ4Fs17'; // Deine Voice ID
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

    async sayTTS(channel, text, userstate) {
        // Check if TTS is enabled
        if (this.enable_tts !== 'true') {
            return;
        }
        try {
            // Sende eine Anfrage an die Elevenlabs API, um den Text in Sprache umzuwandeln
            const response = await axios.post('https://api.elevenlabs.io/v1/text-to-speech', {
                voice_id: this.voiceId,
                text: text,
                model: 'eleven_monolingual_v1',  // Falls ein bestimmtes Modell verwendet wird
                voice_settings: {
                    stability: 0.5,  // Beispiel für Voice Settings, kannst du anpassen
                    clarity: 0.75,
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${this.elevenLabsApiKey}`,
                    'Content-Type': 'application/json',
                },
                responseType: 'arraybuffer',  // Wichtig: Wir erwarten die Audiodaten als ArrayBuffer
            });

            // Überprüfe, ob die Antwort erfolgreich war
            if (response.status !== 200) {
                throw new Error(`Error in TTS request: ${response.statusText}`);
            }

            // Die MP3-Daten aus der Antwort extrahieren
            const buffer = Buffer.from(response.data);

            // Speichern der MP3-Datei auf der Festplatte
            const filePath = './public/file.mp3';
            await fsPromises.writeFile(filePath, buffer);

            // Gib den Pfad der gespeicherten Datei zurück
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
