import { PDCFormData } from './types';
import { nanoid } from 'nanoid';

export const SYSTEM_INSTRUCTION = `Eres un experto en programación y un especialista en planificación educativa bajo la legislación boliviana y documentos curriculares de educación boliviana (Planes y programas de nivel inicial, primaria y secundaria). Tu tarea es generar contenido curricular coherente y relevante basado en los datos proporcionados por el usuario, adhiriéndote estrictamente a la normativa educativa de Bolivia.`;

export const HOLISTIC_OBJECTIVES_BY_NIVEL: Record<string, string> = {
  'Inicial': `Fortalecemos los valores sociocomunitarios en la interrelación Intracultural, Intercultural y Plurilingüismo en armonía y complementariedad
con la Madre Tierra, desarrollando capacidades y habilidades lingüísticas, cognitivas, socioafectivas, psicomotrices, artísticas y creativas, a
través de la observación, exploración, experimentación e investigación, para asumir actitudes inclusivas, de autonomía y toma de decisiones.`,
  'Primaria': `Fortalecemos la práctica de valores sociocomunitarios y principios ético-morales, en el desarrollo del pensamiento crítico; lectura comprensiva, escritura creativa; el pensamiento lógico matemático, resolución de problemas; a través de la convivencia comunitaria biocéntrica; la sensibilidad en las manifestaciones culturales de arte, música, danza, deporte; el uso adecuado de las Tecnologías de Información y Comunicación, la exploración, experimentación e investigación para contribuir a la educación intracultural, intercultural y plurilingüe del Estado Plurinacional, en complementariedad, diálogo de saberes, conocimientos propios y universales.`,
  'Secundaria': `Formamos integralmente a las y los estudiantes con identidad cultural, valores sociocomunitarios, espiritualidad y consciencia crítica, articulando la educación científica, humanística, técnica, tecnológica y artística a través de procesos productivos de acuerdo a las vocaciones y potencialidades de las regiones en el marco de la descolonización, interculturalidad, y plurilingüismo, para que contribuyan a la conservación, protección de la Madre Tierra y salud comunitaria, la construcción de una sociedad democrática, inclusiva y libre de violencia.`
};

export const AREAS_BY_NIVEL: Record<string, string[]> = {
  'Inicial': [
    'Cosmos y Pensamiento',
    'Comunidad y Sociedad',
    'Vida Tierra Territorio',
    'Ciencia Tecnología y Producción',
  ],
  'Primaria': [
    'Valores Espiritualidades y Religiones',
    'Comunicación y Lenguajes',
    'Artes Plásticas y Visuales',
    'Educación Musical',
    'Educación Física y Deportes',
    'Ciencias Sociales',
    'Ciencias Naturales',
    'Matemática',
    'Técnica Tecnológica',
  ],
  'Secundaria': [
    'CIENCIAS NATURALES: BIOLOGÍA – GEOGRAFÍA',
    'CIENCIAS NATURALES: FÍSICA',
    'CIENCIAS NATURALES: QUÍMICA',
    'MATEMÁTICA',
    'TÉCNICA TECNOLÓGICA GENERAL',
    'COMUNICACIÓN Y LENGUAJES: LENGUA CASTELLANA',
    'COMUNICACIÓN Y LENGUAJES: LENGUA ORIGINARIA',
    'LENGUA EXTRANJERA',
    'CIENCIAS SOCIALES',
    'ARTES PLÁSTICAS Y VISUALES',
    'EDUCACIÓN MUSICAL',
    'EDUCACIÓN FÍSICA Y DEPORTES',
    'COSMOVISIONES FILOSOFÍA Y SICOLOGÍA',
    'VALORES ESPIRITUALIDAD Y RELIGIONES',
  ],
};

export const INITIAL_FORM_DATA: PDCFormData = {
  referentialData: {
    distritoEducativo: '',
    unidadEducativa: '',
    nivel: '',
    anioEscolaridad: '',
    directora: '',
    maestra: '',
    areas: [],
    trimestreDel: '',
    trimestreAl: '',
  },
  objetivoHolisticoNivel: '', // Initialized as empty
  knowledgeAreaBlocks: [
    {
      id: nanoid(),
      areaName: '',
      objectiveAprendizaje: '',
      contenidos: {
        week1: '',
        week2: '',
        week3: '',
        week4: '',
        curricularAdaptations: '',
      },
      momentosProcesoFormativo: '',
      recursos: '',
      periodos: '',
      criteriosEvaluacion: { ser: '', saber: '', hacer: '' },
      isLoading: false,
    },
    {
      id: nanoid(),
      areaName: '',
      objectiveAprendizaje: '',
      contenidos: {
        week1: '',
        week2: '',
        week3: '',
        week4: '',
        curricularAdaptations: '',
      },
      momentosProcesoFormativo: '',
      recursos: '',
      periodos: '',
      criteriosEvaluacion: { ser: '', saber: '', hacer: '' },
      isLoading: false,
    },
  ],
  significantAdaptations: [
    {
      id: nanoid(),
      contenido: 'Estudiante 1',
      discapacidadTalentoOtros: '',
      adaptacion: '',
      criterioEvaluacion: '',
      isLoading: false,
    },
    {
      id: nanoid(),
      contenido: 'Estudiante 2',
      discapacidadTalentoOtros: '',
      adaptacion: '',
      criterioEvaluacion: '',
      isLoading: false,
    },
  ],
};