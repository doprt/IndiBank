import { GoogleGenAI, Type } from "@google/genai";
import { SwapRate, GeminiAnalysis, Invoice } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getTreasuryAnalysis = async (rate: SwapRate): Promise<GeminiAnalysis> => {
  if (!process.env.API_KEY) {
    return {
      recommendation: "API Key Missing",
      riskAssessment: "Cannot analyze market conditions without API key.",
      actionItem: "Check configuration."
    };
  }

  const prompt = `
    You are a Senior Treasury Risk Analyst at a major Indian Bank.
    Analyze the following live market data:
    GBP/INR Spot: ${rate.spot}
    SONIA (UK Rate): ${rate.sonia}%
    MIFOR (India Rate): ${rate.mifor}%
    Basis Spread: ${rate.basisSpread} bps.

    Provide a concise JSON response with:
    1. A strategic recommendation (Buy/Sell/Hold Swap).
    2. A risk assessment of the spread widening.
    3. A specific action item for the dealer.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation: { type: Type.STRING },
            riskAssessment: { type: Type.STRING },
            actionItem: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text) as GeminiAnalysis;
    }
    throw new Error("Empty response");

  } catch (error) {
    console.error("Gemini Analysis Failed", error);
    return {
      recommendation: "Analysis Unavailable",
      riskAssessment: "Unable to connect to AI Risk Engine.",
      actionItem: "Proceed with manual calculation."
    };
  }
};

export const getUnderwritingInsight = async (invoice: Invoice): Promise<string> => {
  if (!process.env.API_KEY) return "AI Analysis Offline";

  const prompt = `
    Evaluate credit risk for trade finance.
    Exporter: ${invoice.exporter} (Industry: ${invoice.industry}).
    Importer: ${invoice.importer}.
    Amount: GBP ${invoice.amountGBP}.
    Integrity Checks: GSTN=${invoice.integrity.gstnVerified}, BL=${invoice.integrity.logisticsVerified}, DPC=${invoice.integrity.dpcVerified}.
    
    Provide a 1-sentence risk summary for the underwriter.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "No insight generated.";
  } catch (e) {
    return "Error generating insight.";
  }
}

export const getCommodityAnalysis = async (commodityName: string): Promise<string> => {
  if (!process.env.API_KEY) return "AI News Feed Offline";

  const prompt = `
    You are a Commodity Risk Specialist.
    Provide a 1-sentence real-time news impact summary for: ${commodityName}.
    Focus on supply chain disruptions, price volatility, or geopolitical factors affecting trade between India and UK.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "No recent news events found.";
  } catch (e) {
    return "Error fetching commodity news.";
  }
}