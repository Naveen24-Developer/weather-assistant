
import { GoogleGenAI, Chat, FunctionDeclaration, Type, Tool, FunctionCall } from "@google/genai";
import { getWeather } from "./weatherService";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });


// Define the tool
const weatherTool: FunctionDeclaration = {
  name: "get_current_weather",
  description: "Get the current weather for a specific location. Always use this tool when the user asks about weather.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: {
        type: Type.STRING,
        description: "The city and country, e.g. London, UK or Tokyo, JP",
      },
    },
    required: ["location"],
  },
};

const tools: Tool[] = [{ functionDeclarations: [weatherTool] }];

const systemInstruction = `
You are SkyCast, a specialized, friendly, and professional weather AI assistant.
Your goal is to provide accurate weather information using the available tools.

RULES:
1. GREETINGS: If the user says "hi", "hello", or similar greetings, reply warmly and introduce yourself as a weather assistant. Ask them where they would like to check the weather.
2. WEATHER ONLY: You are strictly limited to weather-related topics. 
   - If the user asks about the weather, ALWAYS use the 'get_current_weather' tool.
   - If the user asks a general question (e.g., "What is the capital of France?", "Write a poem"), politely REFUSE. 
   - Say something like: "I'm sorry, but I can only help with weather-related inquiries. Would you like to check the weather somewhere?"
3. PERSONALITY: Be polite, concise, and helpful. Use emojis occasionally to be friendly (e.g., 🌤️, 🌧️).
4. DATA PRESENTATION: When presenting weather data, make it easy to read. Mention the temperature, condition, and key details like humidity or wind.
5. REALTIME: Always fetch real-time data using the tool. Do not guess.
`;

let chatSession: Chat | null = null;

export const initializeChat = () => {
  chatSession = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction,
      tools,
      temperature: 0.7,
    },
  });
};

export type StreamCallback = (chunkText: string, done: boolean) => void;
export type ToolCallCallback = (toolCall: FunctionCall) => void;

/**
 * Helper to process the stream. 
 * It consumes the full stream to ensure the SDK updates its internal history state.
 */
const processStream = async (
    result: any, 
    onStream: StreamCallback, 
    onToolCall: ToolCallCallback
) => {
    let functionCallFound: FunctionCall | null = null;

    try {
        for await (const chunk of result) {
            const text = chunk.text;
            if (text) {
                onStream(text, false);
            }

            const fc = chunk.functionCalls;
            if (fc && fc.length > 0) {
                functionCallFound = fc[0];
                // Note: We do NOT break here. We must let the stream drain
                // so the SDK sees the turn as complete and adds it to history.
            }
        }
    } catch (error) {
        console.error("Stream processing error:", error);
        throw error;
    }

    // After stream is fully consumed
    if (functionCallFound) {
        onToolCall(functionCallFound);
    } else {
        onStream("", true);
    }
};

/**
 * Sends a user message.
 */
export const sendUserMessage = async (
  message: string,
  onStream: StreamCallback,
  onToolCall: ToolCallCallback
) => {
  if (!chatSession) initializeChat();
  if (!chatSession) throw new Error("Failed to initialize chat session");

  try {
    const result = await chatSession.sendMessageStream({ message });
    await processStream(result, onStream, onToolCall);
  } catch (error) {
    console.error("Gemini Error:", error);
    chatSession = null;
    onStream("\n[System]: Sorry, I encountered an error. Please try again.", true);
  }
};

/**
 * Sends a tool response (manual confirmation result) back to the model.
 */
export const sendToolResponse = async (
    id: string,
    name: string,
    response: any,
    onStream: StreamCallback,
    onToolCall: ToolCallCallback
) => {
    if (!chatSession) throw new Error("No active chat session");

    try {
        const result = await chatSession.sendMessageStream({
            message: [{
                functionResponse: {
                    id: id, 
                    name: name,
                    response: response 
                }
            }]
        });
        await processStream(result, onStream, onToolCall);
    } catch (error) {
        console.error("Gemini Tool Response Error:", error);
        chatSession = null;
        onStream("\n[System]: Sorry, I encountered an error processing the tool response.", true);
    }
}
