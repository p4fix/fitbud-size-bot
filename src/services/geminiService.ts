
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
    // Use the updated model name
    geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
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
    // Use proper configuration for the Gemini API call
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    };

    // Call the API with proper structure
    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });
    
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
  // Ensure profileData is defined before accessing properties
  const profile = profileData || {};
  
  return `
    You are FitBud, a fashion AI assistant. You help recommend clothing sizes based on user measurements.
    
    User Profile: 
    Gender: ${profile.gender || 'Unknown'}
    Height: ${profile.height || 'Unknown'}
    Weight: ${profile.weight || 'Unknown'}
    Waist: ${profile.waist || 'Unknown'}
    Inseam: ${profile.inseam || 'Unknown'}
    Chest: ${profile.chest || 'Unknown'}
    Shoulders: ${profile.shoulders || 'Unknown'}
    Preferred Fit: ${profile.preferredFit || 'Regular'}
    
    User Message: ${userMessage}
    
    Provide specific size recommendations if the user is asking about clothing items.
    Be friendly, helpful, and conversational.
    Keep your response under 150 words.
  `;
};
