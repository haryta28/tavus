import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Tavus API configuration
const TAVUS_API_KEY = process.env.TAVUS_API_KEY;
const TAVUS_API_BASE = 'https://tavusapi.com';
const TAVUS_REPLICA_ID = process.env.TAVUS_REPLICA_ID;
const TAVUS_PERSONA_ID = process.env.TAVUS_PERSONA_ID;
const TAVUS_DOCUMENT_IDS = process.env.TAVUS_DOCUMENT_IDS ? process.env.TAVUS_DOCUMENT_IDS.split(',') : [];

// Validate API key and configuration on startup
if (!TAVUS_API_KEY) {
    console.error('ERROR: TAVUS_API_KEY is not set in environment variables');
    console.error('Please create a .env file with your Tavus API key');
    process.exit(1);
}

if (!TAVUS_REPLICA_ID || !TAVUS_PERSONA_ID || TAVUS_DOCUMENT_IDS.length === 0) {
    console.error('ERROR: Missing Tavus configuration in environment variables');
    console.error('Please ensure TAVUS_REPLICA_ID, TAVUS_PERSONA_ID, and TAVUS_DOCUMENT_IDS are set');
    process.exit(1);
}



/**
 * Create a conversation with the specified parameters
 */
app.post('/api/create-conversation', async (req, res) => {
    try {
        console.log(`Creating conversation with ${TAVUS_DOCUMENT_IDS.length} document(s)`);

        const conversationPayload = {
            replica_id: TAVUS_REPLICA_ID,
            persona_id: TAVUS_PERSONA_ID,
            conversation_name: 'explainer',
            conversational_context: 'Detail explainer about the company haloocom',
            custom_greeting: 'Hi, My name is Echo, and welcome to HalOOcom. How can I assist you today?',
            properties: {
                enable_recording: false
            },
            document_ids: TAVUS_DOCUMENT_IDS
        };

        const response = await fetch(`${TAVUS_API_BASE}/v2/conversations`, {
            method: 'POST',
            headers: {
                'x-api-key': TAVUS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(conversationPayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Tavus API Error:', errorText);
            throw new Error(`Tavus API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Conversation created successfully:', data);

        // Optional: Log to Supabase
        if (supabase) {
            const { error: logError } = await supabase
                .from('conversation_logs')
                .insert([
                    {
                        conversation_id: data.conversation_id,
                        conversation_url: data.conversation_url,
                        status: data.status
                    }
                ]);

            if (logError) {
                console.error('Error logging to Supabase:', logError);
            } else {
                console.log('Successfully logged to Supabase');
            }
        }

        res.json({
            success: true,
            conversationUrl: data.conversation_url
        });
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Serve main.html at root path
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        apiKeyConfigured: !!TAVUS_API_KEY
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Echo server running on http://localhost:${PORT}`);
    console.log(`📡 Tavus API key configured: ${TAVUS_API_KEY ? 'Yes' : 'No'}`);
});
