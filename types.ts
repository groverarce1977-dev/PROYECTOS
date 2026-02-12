export interface ReferentialData {
  distritoEducativo: string;
  unidadEducativa: string;
  nivel: string;
  anioEscolaridad: string;
  directora: string;
  maestra: string;
  areas: string[]; // Changed to string array
  trimestreDel: string;
  trimestreAl: string;
}

export interface CurricularContent {
  week1: string;
  week2: string;
  week3: string;
  week4: string;
  curricularAdaptations: string;
}

export interface CriteriaEvaluacion {
  ser: string;
  saber: string;
  hacer: string;
}

export interface KnowledgeAreaBlock {
  id: string;
  areaName: string;
  objectiveAprendizaje: string;
  contenidos: CurricularContent;
  momentosProcesoFormativo: string;
  recursos: string;
  periodos: string;
  criteriosEvaluacion: CriteriaEvaluacion;
  isLoading?: boolean;
}

export interface SignificantAdaptation {
  id: string;
  contenido: string;
  discapacidadTalentoOtros: string;
  adaptacion: string;
  criterioEvaluacion: string;
  isLoading?: boolean;
}

export interface PDCFormData {
  referentialData: ReferentialData;
  objetivoHolisticoNivel: string;
  knowledgeAreaBlocks: KnowledgeAreaBlock[];
  significantAdaptations: SignificantAdaptation[];
}

// For Gemini API response
export interface GeminiKnowledgeAreaResponse {
  objectiveAprendizaje: string;
  momentosProcesoFormativo: string;
  recursos: string;
  periodos: string;
  criteriosEvaluacion: CriteriaEvaluacion;
}

export interface GeminiSignificantAdaptationResponse {
  adaptacion: string;
  criterioEvaluacion: string;
}