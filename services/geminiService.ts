
import { GoogleGenAI } from "@google/genai";
import { ArtPiece, GenerationParams, AuctionData } from "../types";
import { BASE_PROMPT_TEMPLATE, PERIODS, ARTIST_NAMES } from "../constants";

/**
 * Calls the Google Gemini API to generate a Cubist artwork based on the provided parameters.
 * Also generates mock commercial data (auction price, rating, etc.) for the piece.
 * 
 * @param params - The subject and period configuration.
 * @returns A promise that resolves to a fully populated ArtPiece object.
 */
export const generateArtPiece = async (params: GenerationParams): Promise<ArtPiece> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const periodDesc = PERIODS[params.period];

  // Inject variables into the user's prompt template
  const fullPrompt = BASE_PROMPT_TEMPLATE
    .replace('[SUBJECT]', params.subject)
    .replace('[PALETTE]', periodDesc);

  try {
    // Uses 'gemini-2.5-flash-image' for fast, permission-friendly image generation.
    // Note: 'imageSize' config is excluded as it is not supported by the Flash model.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4", 
        }
      },
    });

    let imageUrl = '';
    
    // Extract base64 image data from the response structure
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image generated.");
    }

    // Generate a title based on the params
    const capitalizedSubject = params.subject.charAt(0).toUpperCase() + params.subject.slice(1);
    const title = `${capitalizedSubject} in ${params.period}`;

    // --- MOCK AUCTION DATA GENERATION ---
    const basePrice = Math.random() * 2 + 0.1; // 0.1 to 2.1 base
    const hypeFactor = Math.random() * 2;
    const currentBid = parseFloat((basePrice + hypeFactor).toFixed(2));
    const startingBid = parseFloat((basePrice * 0.8).toFixed(2));
    const bidCount = Math.floor(Math.random() * 40) + 2;
    const likes = Math.floor(Math.random() * 1500) + 50;
    const rating = parseFloat((Math.random() * (9.9 - 7.5) + 7.5).toFixed(1)); // 7.5 to 9.9
    
    // Random future time between 2 hours and 48 hours
    const endTime = Date.now() + (Math.floor(Math.random() * 46) + 2) * 60 * 60 * 1000;
    
    const randomArtist = ARTIST_NAMES[Math.floor(Math.random() * ARTIST_NAMES.length)];

    const auctionData: AuctionData = {
        currentBid,
        startingBid,
        bidCount,
        likes,
        rating,
        endTime,
        artistName: randomArtist
    };

    return {
      id: crypto.randomUUID(),
      url: imageUrl,
      title: title,
      description: `Avant-garde composition featuring ${params.subject}, executed in ${periodDesc}.`,
      subject: params.subject,
      period: params.period,
      timestamp: Date.now(),
      prompt: fullPrompt,
      auction: auctionData
    };

  } catch (error) {
    console.error("Error generating art:", error);
    throw error;
  }
};
