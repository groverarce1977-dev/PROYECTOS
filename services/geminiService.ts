import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import {
  GeminiKnowledgeAreaResponse,
  GeminiSignificantAdaptationResponse,
  KnowledgeAreaBlock,
  SignificantAdaptation,
} from '../types';

const getGeminiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error('API_KEY environment variable is not set.');
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateKnowledgeAreaContent = async (
  areaData: {
    areaName: string;
    objectiveAprendizaje: string;
    contenidos: {
      week1: string;
      week2: string;
      week3: string;
      week4: string;
      curricularAdaptations: string;
    };
  },
  objetivoHolisticoNivel: string,
  nivel: string, // New parameter
  anioEscolaridad: string, // New parameter
): Promise<GeminiKnowledgeAreaResponse> => {
  const ai = getGeminiClient();

  const prompt = `Eres un experto en planificación educativa de Bolivia. Genera el 'Objetivo de aprendizaje', 'Momentos del proceso formativo', 'Recursos', 'Periodos', y los 'Criterios de evaluación' (SER, SABER, HACER) para el siguiente bloque de contenido curricular, en formato JSON.
Considera el Nivel educativo: "${nivel}" y el Año de escolaridad: "${anioEscolaridad}".
El área de saberes y conocimientos es: "${areaData.areaName}".
El objetivo de aprendizaje propuesto (si aplica o se deja en blanco, completa o refina): "${areaData.objectiveAprendizaje}".
Los contenidos son:
- Semana 1: ${areaData.contenidos.week1}
- Semana 2: ${areaData.contenidos.week2}
- Semana 3: ${areaData.contenidos.week3}
- Semana 4: ${areaData.contenidos.week4}
- Adaptaciones Curriculares (generales y específicos): ${areaData.contenidos.curricularAdaptations}

El objetivo holístico general del nivel es: "${objetivoHolisticoNivel}".
Por favor, asegúrate de que el 'Objetivo de aprendizaje' sea conciso y el 'Momentos del proceso formativo' sea una descripción detallada de actividades. Los 'Recursos' deben ser una lista de materiales. Los 'Periodos' deben indicar la duración en semanas o días. Los 'Criterios de evaluación' (SER, SABER, HACER) deben estar alineados con los contenidos y el objetivo.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            objectiveAprendizaje: {
              type: Type.STRING,
              description: 'El objetivo de aprendizaje para el bloque.',
            },
            momentosProcesoFormativo: {
              type: Type.STRING,
              description: 'Los momentos del proceso formativo (actividades) en un párrafo detallado.',
            },
            recursos: {
              type: Type.STRING,
              description: 'Lista de recursos necesarios, separados por comas.',
            },
            periodos: {
              type: Type.STRING,
              description: 'Duración estimada en semanas o días.',
            },
            criteriosEvaluacion: {
              type: Type.OBJECT,
              properties: {
                ser: {
                  type: Type.STRING,
                  description: 'Criterios de evaluación para el SER.',
                },
                saber: {
                  type: Type.STRING,
                  description: 'Criterios de evaluación para el SABER.',
                },
                hacer: {
                  type: Type.STRING,
                  description: 'Criterios de evaluación para el HACER.',
                },
              },
              required: ['ser', 'saber', 'hacer'],
            },
          },
          required: [
            'objectiveAprendizaje',
            'momentosProcesoFormativo',
            'recursos',
            'periodos',
            'criteriosEvaluacion',
          ],
        },
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const jsonString = response.text?.trim();
    if (!jsonString) {
      throw new Error('Gemini returned an empty response.');
    }
    return JSON.parse(jsonString) as GeminiKnowledgeAreaResponse;
  } catch (error) {
    console.error('Error generating knowledge area content:', error);
    throw error;
  }
};

export const generateSignificantAdaptationContent = async (
  adaptationData: {
    contenido: string;
    discapacidadTalentoOtros: string;
  },
  objetivoHolisticoNivel: string,
): Promise<GeminiSignificantAdaptationResponse> => {
  const ai = getGeminiClient();

  const prompt = `Considerando el objetivo holístico general del nivel: "${objetivoHolisticoNivel}", y el siguiente estudiante, genera una 'Adaptación' y 'Criterio de evaluación' específicos en formato JSON.
Contenido relacionado: "${adaptationData.contenido}"
Discapacidad/Talento extraordinario/TDH/TEA y otros: "${adaptationData.discapacidadTalentoOtros}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            adaptacion: {
              type: Type.STRING,
              description: 'La adaptación curricular propuesta para el estudiante.',
            },
            criterioEvaluacion: {
              type: Type.STRING,
              description: 'El criterio de evaluación para la adaptación.',
            },
          },
          required: ['adaptacion', 'criterioEvaluacion'],
        },
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const jsonString = response.text?.trim();
    if (!jsonString) {
      throw new Error('Gemini returned an empty response.');
    }
    return JSON.parse(jsonString) as GeminiSignificantAdaptationResponse;
  } catch (error) {
    console.error('Error generating significant adaptation content:', error);
    throw error;
  }
};