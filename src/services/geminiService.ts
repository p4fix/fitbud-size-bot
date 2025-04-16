
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyAzsNUl-hTJhM9VVJuegfBJf2boNtMAZXM';

let geminiModel: any = null;

// Initialize the Gemini API
export const initializeGemini = async () => {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    return true;
  } catch (error) {
    console.error('Error initializing Gemini API:', error);
    return false;
  }
};

// Generate a response from the Gemini API
export const generateResponse = async (prompt: string, userProfile: any) => {
  if (!geminiModel) {
    const initialized = await initializeGemini();
    if (!initialized) {
      throw new Error('Failed to initialize Gemini API');
    }
  }

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response from Gemini:', error);
    throw error;
  }
};

// Create a prompt with context for the Gemini API
export const createPromptWithContext = (userMessage: string, profileData: any, clothingDatabase: any) => {
  return `
    As a fashion AI assistant, help recommend clothing sizes based on this context:
    User Profile: ${JSON.stringify(profileData)}
    User Message: ${userMessage}
    Available Clothing Database: ${JSON.stringify(clothingDatabase)}
    
    Provide specific size recommendations if the user is asking about clothing items.
    Keep responses friendly and conversational.
  `;
};
