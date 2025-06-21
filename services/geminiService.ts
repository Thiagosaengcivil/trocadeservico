
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn(
    "Chave da API Gemini não encontrada. Defina a variável de ambiente process.env.API_KEY. Recursos de IA estarão desabilitados."
  );
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const generateServiceDescriptionWithGemini = async (
  serviceKeywords: string,
  profession: string
): Promise<string> => {
  if (!ai) {
    return "Serviço de IA indisponível. Verifique a configuração da chave da API.";
  }

  const prompt = `
    Você é um redator especialista ajudando um usuário a criar uma oferta de serviço atraente para uma plataforma de troca de habilidades.
    A profissão do usuário é: ${profession}.
    O serviço que deseja oferecer está relacionado a: "${serviceKeywords}".

    Gere uma descrição concisa, persuasiva e amigável para este serviço.
    Destaque os principais benefícios para quem procura trocar serviços em vez de pagar por eles.
    A descrição deve ter de 1 a 2 frases, no máximo 60 palavras.
    Faça com que pareça atraente e confiável.
    Exemplo: "${profession} especialista oferecendo ${serviceKeywords}. Vamos trocar habilidades e nos ajudar a crescer sem abrir nossas carteiras!"
    
    Descrição Gerada:
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 100, // Max tokens for the generated description
      }
    });

    if (response && typeof response.text === 'string') {
      return response.text.trim();
    } else {
      console.warn("Resposta da API Gemini não continha um campo de texto ou estava malformada:", response);
      return "Não foi possível gerar a descrição (resposta inesperada da IA). Por favor, tente escrever uma manualmente.";
    }
  } catch (error) {
    console.error("Erro ao gerar descrição do serviço com Gemini:", error);
    // It's good practice to check if error has a message property
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `Não foi possível gerar a descrição no momento devido a um erro (${errorMessage}). Por favor, tente escrever uma manualmente.`;
  }
};
