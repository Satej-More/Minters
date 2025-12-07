
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { country, question, context } = await req.json();

    if (question && context) {
      // Follow-up question logic
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `Based on the following IPR information for ${country}, answer the user's question. Provide a very concise and short answer in plain text format only. Do not include any formatting like bullet points or bold text.
        Context: ${JSON.stringify(context)}
        Question: ${question}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      return NextResponse.json({ answer: text });
    } else {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `Provide a detailed and structured breakdown of the Intellectual Property Rights (IPR) for ${country}. I need a structured JSON output with the following schema:
        {
          "country": "CountryName",
          "clarity": "Clear/Moderate/Complex",
          "propertiesAndLaws": {
            "introduction": "A brief introduction to the country's IPR landscape.",
            "types": [
              {
                "name": "Patents",
                "description": "Details about patent laws, duration, and what can be patented.",
                "keyLaws": ["Law 1", "Law 2"]
              },
              {
                "name": "Trademarks",
                "description": "Details about trademark laws, duration, and what can be registered.",
                "keyLaws": ["Law 1", "Law 2"]
              },
              {
                "name": "Copyrights",
                "description": "Details about copyright laws, duration, and what is protected.",
                "keyLaws": ["Law 1", "Law 2"]
              }
            ]
          },
          "enforcement": {
            "introduction": "Overview of IPR enforcement in the country.",
            "authorities": ["Authority 1", "Authority 2"],
            "penalties": "Description of penalties for IPR infringement."
          },
          "protectionAndLoss": {
            "protectionBenefits": "Economic and social benefits of strong IPR protection.",
            "lossConsequences": "Consequences of IPR loss or infringement."
          },
          "conservationProcess": {
            "introduction": "Introduction to protecting your IP in this country.",
            "steps": [
              {
                "step": 1,
                "title": "Initial Assessment",
                "description": "How to assess if your IP is protectable."
              },
              {
                "step": 2,
                "title": "Application",
                "description": "The process of applying for IPR protection."
              },
              {
                "step": 3,
                "title": "Maintenance",
                "description": "How to maintain your IPR protection."
              }
            ]
          }
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = await response.text();
      
      text = text.replace(/```json|```/g, '').trim();
      
      try {
        const iprInfo = JSON.parse(text);
        return NextResponse.json(iprInfo);
      } catch (e) {
        console.error("Failed to parse Gemini response:", text);
        throw new Error("Failed to parse IPR information from the AI model.");
      }
    }
  }
 catch (error: any) {
    console.error('Error in IPR info API:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
