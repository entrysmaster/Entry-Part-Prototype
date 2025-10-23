
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, ForecastResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getConsumptionForecast = async (partName: string, transactions: Transaction[]): Promise<ForecastResult | null> => {
  if (transactions.length < 2) {
    return null;
  }

  const historicalData = transactions
    .filter(t => t.type === 'Check Out')
    .map(t => ({
      date: new Date(t.timestamp).toISOString().split('T')[0],
      quantity: -t.quantityChange,
    }))
    .slice(0, 100); // Limit data points to keep prompt concise

  const prompt = `
    Analyze the following historical consumption data for the part "${partName}".
    The data shows the quantity checked out on specific dates.

    Historical Data:
    ${JSON.stringify(historicalData, null, 2)}

    Based on this data, provide a consumption forecast and actionable insights.
    Calculate the average daily usage, then project the total consumption for the next 3 months, 6 months, and 1 year.
    Provide one key insight about the consumption pattern.
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
            forecast: {
              type: Type.OBJECT,
              properties: {
                daily_avg: { type: Type.NUMBER },
                three_month: { type: Type.NUMBER },
                six_month: { type: Type.NUMBER },
                one_year: { type: Type.NUMBER },
              },
            },
            insights: {
              type: Type.STRING,
              description: "A brief, actionable insight based on the data."
            },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as ForecastResult;

  } catch (error) {
    console.error("Error fetching forecast from Gemini API:", error);
    return null;
  }
};
