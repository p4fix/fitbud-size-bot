
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyAzsNUl-hTJhM9VVJuegfBJf2boNtMAZXM';

let geminiModel: any = null;

// Initialize the Gemini API
export const initializeGemini = async () => {
  try {
    console.log("Initializing Gemini API...");
    if (!API_KEY) {
      console.error('Missing Gemini API Key');
      return false;
    }
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Test the model with a simple query to ensure it's working
    const result = await geminiModel.generateContent("Hello, are you working?");
    const response = await result.response;
    console.log("Gemini API test response received");
    
    return true;
  } catch (error) {
    console.error('Error initializing Gemini API:', error);
    return false;
  }
};

// Generate a response from the Gemini API
export const generateResponse = async (prompt: string, userProfile: any) => {
  console.log("Generating response with prompt:", prompt.substring(0, 100) + "...");
  
  if (!geminiModel) {
    console.log("Gemini model not initialized, attempting to initialize...");
    const initialized = await initializeGemini();
    if (!initialized) {
      throw new Error('Failed to initialize Gemini API');
    }
  }

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    console.log("Gemini response received");
    return response.text();
  } catch (error) {
    console.error('Error generating response from Gemini:', error);
    throw error;
  }
};

// Create a prompt with context for the Gemini API
export const createPromptWithContext = (userMessage: string, profileData: any, clothingDatabase: any) => {
  return `
    You are FitBud, a fashion AI assistant. You help recommend clothing sizes based on user measurements.
    
    User Profile: 
    Gender: ${profileData.gender || 'Unknown'}
    Height: ${profileData.height || 'Unknown'}
    Weight: ${profileData.weight || 'Unknown'}
    Waist: ${profileData.waist || 'Unknown'}
    Inseam: ${profileData.inseam || 'Unknown'}
    Chest: ${profileData.chest || 'Unknown'}
    Shoulders: ${profileData.shoulders || 'Unknown'}
    Preferred Fit: ${profileData.preferredFit || 'Regular'}
    
    User Message: ${userMessage}
    
    Provide specific size recommendations if the user is asking about clothing items.
    Be friendly, helpful, and conversational.
    Keep your response under 150 words.
  `;
};
