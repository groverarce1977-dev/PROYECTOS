import React, { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { PDCFormData, ReferentialData, KnowledgeAreaBlock, SignificantAdaptation, CurricularContent, CriteriaEvaluacion } from './types';
import { INITIAL_FORM_DATA, HOLISTIC_OBJECTIVES_BY_NIVEL } from './constants';
import ReferentialDataForm from './forms/ReferentialDataForm';
import HolisticObjectiveSection from './forms/HolisticObjectiveSection';
import KnowledgeAreaBlockForm from './forms/KnowledgeAreaBlockForm';
import SignificantAdaptationForm from './forms/SignificantAdaptationForm';
import Button from './ui/Button';
import LoadingSpinner from './common/LoadingSpinner';
import { generateKnowledgeAreaContent, generateSignificantAdaptationContent } from './services/geminiService';
import generatePDCWordDocument from './services/wordGeneratorService';
// Removed: import generatePDCPdfDocument from './services/pdfGeneratorService';

const App: React.FC = () => {
  const [formData, setFormData] = useState<PDCFormData>(INITIAL_FORM_DATA);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  // Removed: const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getNivelTitle = (nivel: string) => {
    switch (nivel) {
      case 'Inicial':
        return 'EDUCACIÓN INICIAL EN FAMILIA COMUNITARIA';
      case 'Primaria':
        return 'EDUCACIÓN PRIMARIA COMUNITARIA VOCACIONAL';
      case 'Secundaria':
        return 'EDUCACIÓN SECUNDARIA COMUNITARIA PRODUCTIVA';
      default:
        return 'PLANIFICACIÓN EDUCATIVA';
    }
  };

  const handleReferentialDataChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | { name: string, value: string | string[] }>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updatedObjetivoHolisticoNivel = prev.objetivoHolisticoNivel;
      let updatedKnowledgeAreaBlocks = prev.knowledgeAreaBlocks;
      let updatedReferentialData: ReferentialData = {
        ...prev.referentialData,
        [name]: value,
      };

      if (name === 'nivel' && typeof value === 'string') {
        const newNivel = value;
        if (!prev.objetivoHolisticoNivel || HOLISTIC_OBJECTIVES_BY_NIVEL[newNivel]) {
           updatedObjetivoHolisticoNivel = HOLISTIC_OBJECTIVES_BY_NIVEL[newNivel] || '';
        }
      }

      if (name === 'areas' && Array.isArray(value)) {
        const newAreas = value as string[];
        const prevAreas = prev.referentialData.areas;

        // Filter out blocks for areas that are no longer selected
        let filteredBlocks = prev.knowledgeAreaBlocks.filter(block => newAreas.includes(block.areaName));

        // Add new blocks for areas that are newly selected
        const existingAreaNamesInBlocks = new Set(filteredBlocks.map(block => block.areaName));
        const areasToAdd = newAreas.filter(area => !existingAreaNamesInBlocks.has(area));

        const newBlocks: KnowledgeAreaBlock[] = areasToAdd.map(area => ({
          id: nanoid(),
          areaName: area,
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
        }));

        updatedKnowledgeAreaBlocks = [...filteredBlocks, ...newBlocks];
      }

      return {
        ...prev,
        referentialData: updatedReferentialData,
        objetivoHolisticoNivel: updatedObjetivoHolisticoNivel,
        knowledgeAreaBlocks: updatedKnowledgeAreaBlocks,
      };
    });
  }, []);

  const handleHolisticObjectiveChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      objetivoHolisticoNivel: value,
    }));
  }, []);

  const handleKnowledgeAreaBlockChange = useCallback(
    (id: string, field: string, value: string | CurricularContent | CriteriaEvaluacion) => {
      setFormData((prev) => ({
        ...prev,
        knowledgeAreaBlocks: prev.knowledgeAreaBlocks.map((block) =>
          block.id === id ? { ...block, [field]: value } : block
        ),
      }));
    },
    []
  );

  // Removed addKnowledgeAreaBlock as blocks are now generated via areas selection

  const removeKnowledgeAreaBlock = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      knowledgeAreaBlocks: prev.knowledgeAreaBlocks.filter((block) => block.id !== id),
    }));
  }, []);

  const handleSignificantAdaptationChange = useCallback(
    (id: string, field: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        significantAdaptations: prev.significantAdaptations.map((adaptation) =>
          adaptation.id === id ? { ...adaptation, [field]: value } : adaptation
        ),
      }));
    },
    []
  );

  const addSignificantAdaptation = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      significantAdaptations: [
        ...prev.significantAdaptations,
        {
          id: nanoid(),
          contenido: `Estudiante ${prev.significantAdaptations.length + 1}`,
          discapacidadTalentoOtros: '',
          adaptacion: '',
          criterioEvaluacion: '',
          isLoading: false,
        },
      ],
    }));
  }, []);

  const removeSignificantAdaptation = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      significantAdaptations: prev.significantAdaptations.filter((adaptation) => adaptation.id !== id),
    }));
  }, []);

  const generateSingleKnowledgeAreaBlock = useCallback(
    async (id: string) => {
      setError(null);
      setFormData((prev) => ({
        ...prev,
        knowledgeAreaBlocks: prev.knowledgeAreaBlocks.map((block) =>
          block.id === id ? { ...block, isLoading: true } : block
        ),
      }));

      const blockToGenerate = formData.knowledgeAreaBlocks.find((block) => block.id === id);
      if (!blockToGenerate || !blockToGenerate.areaName || !blockToGenerate.contenidos.week1) {
        setError('Por favor, complete el Nombre del Área y al menos una semana de Contenidos para generar.');
        setFormData((prev) => ({
          ...prev,
          knowledgeAreaBlocks: prev.knowledgeAreaBlocks.map((block) =>
            block.id === id ? { ...block, isLoading: false } : block
          ),
        }));
        return;
      }

      try {
        const generatedContent = await generateKnowledgeAreaContent(
          {
            areaName: blockToGenerate.areaName,
            objectiveAprendizaje: blockToGenerate.objectiveAprendizaje,
            contenidos: blockToGenerate.contenidos,
          },
          formData.objetivoHolisticoNivel,
          formData.referentialData.nivel, // Pass nivel
          formData.referentialData.anioEscolaridad // Pass anioEscolaridad
        );

        setFormData((prev) => ({
          ...prev,
          knowledgeAreaBlocks: prev.knowledgeAreaBlocks.map((block) =>
            block.id === id
              ? {
                  ...block,
                  ...generatedContent,
                  isLoading: false,
                }
              : block
          ),
        }));
      } catch (err) {
        console.error('Error generating block content:', err);
        setError(`Error al generar el contenido del bloque: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setFormData((prev) => ({
          ...prev,
          knowledgeAreaBlocks: prev.knowledgeAreaBlocks.map((block) =>
            block.id === id ? { ...block, isLoading: false } : block
          ),
        }));
      }
    },
    [formData.knowledgeAreaBlocks, formData.objetivoHolisticoNivel, formData.referentialData.nivel, formData.referentialData.anioEscolaridad]
  );

  const generateSingleSignificantAdaptation = useCallback(
    async (id: string) => {
      setError(null);
      setFormData((prev) => ({
        ...prev,
        significantAdaptations: prev.significantAdaptations.map((adaptation) =>
          adaptation.id === id ? { ...adaptation, isLoading: true } : adaptation
        ),
      }));

      const adaptationToGenerate = formData.significantAdaptations.find((adaptation) => adaptation.id === id);
      if (!adaptationToGenerate || !adaptationToGenerate.contenido || !adaptationToGenerate.discapacidadTalentoOtros) {
        setError('Por favor, complete el Contenido y la Discapacidad/Talento para generar la adaptación.');
        setFormData((prev) => ({
          ...prev,
          significantAdaptations: prev.significantAdaptations.map((adaptation) =>
            adaptation.id === id ? { ...adaptation, isLoading: false } : adaptation
          ),
        }));
        return;
      }

      try {
        const generatedContent = await generateSignificantAdaptationContent(
          {
            contenido: adaptationToGenerate.contenido,
            discapacidadTalentoOtros: adaptationToGenerate.discapacidadTalentoOtros,
          },
          formData.objetivoHolisticoNivel
        );

        setFormData((prev) => ({
          ...prev,
          significantAdaptations: prev.significantAdaptations.map((adaptation) =>
            adaptation.id === id
              ? {
                  ...adaptation,
                  ...generatedContent,
                  isLoading: false,
                }
              : adaptation
          ),
        }));
      } catch (err) {
        console.error('Error generating adaptation content:', err);
        setError(`Error al generar la adaptación: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        // Fix: Changed 'block' to 'adaptation' as this function operates on significantAdaptations
        setFormData((prev) => ({
          ...prev,
          significantAdaptations: prev.significantAdaptations.map((adaptation) =>
            adaptation.id === id ? { ...adaptation, isLoading: false } : adaptation
          ),
        }));
      }
    },
    [formData.significantAdaptations, formData.objetivoHolisticoNivel]
  );

  const generateAllContent = useCallback(async () => {
    setError(null);
    setIsGeneratingAll(true);

    const blocksToGeneratePromises = formData.knowledgeAreaBlocks.map((block) => {
      if (block.areaName && block.contenidos.week1) { // Only generate if essential fields are filled
        return generateSingleKnowledgeAreaBlock(block.id);
      }
      return Promise.resolve(); // Skip generation for incomplete blocks
    });

    const adaptationsToGeneratePromises = formData.significantAdaptations.map((adaptation) => {
      if (adaptation.contenido && adaptation.discapacidadTalentoOtros) { // Only generate if essential fields are filled
        return generateSingleSignificantAdaptation(adaptation.id);
      }
      return Promise.resolve(); // Skip generation for incomplete adaptations
    });

    try {
      await Promise.allSettled([...blocksToGeneratePromises, ...adaptationsToGeneratePromises]);
      // Note: Promise.allSettled allows all promises to resolve/reject independently
      // We will rely on individual error states for blocks/adaptations for specific errors
    } catch (err) {
      console.error('Error during batch generation:', err);
      // This catch might not be hit if using allSettled effectively, but kept for general safety
      setError(`Error general al generar el PDC: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsGeneratingAll(false);
    }
  }, [formData, generateSingleKnowledgeAreaBlock, generateSingleSignificantAdaptation]); // Add specific dependencies

  const handleDownloadWord = useCallback(async () => {
    setError(null);
    setIsDownloadingWord(true);
    try {
      await generatePDCWordDocument(formData);
    } catch (err) {
      console.error('Error al descargar el documento de Word:', err);
      setError(`Error al descargar el documento de Word: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsDownloadingWord(false);
    }
  }, [formData]);

  // Removed: handleDownloadPdf useCallback

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <header className="text-center mb-8 border-pdc p-4 bg-white shadow-sm">
        <h1 className="text-xl md::text-2xl font-bold text-gray-900 mb-1">{getNivelTitle(formData.referentialData.nivel)}</h1>
        <h2 className="text-lg md:text-xl font-semibold text-gray-700">PLAN DE DESARROLLO CURRICULAR Nº 1</h2>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      <main className="bg-white p-4 md:p-6 shadow-lg rounded-lg mb-20">
        <ReferentialDataForm data={formData.referentialData} onChange={handleReferentialDataChange} />
        <HolisticObjectiveSection objetivo={formData.objetivoHolisticoNivel} onChange={handleHolisticObjectiveChange} />

        <section className="mb-8">
          {formData.knowledgeAreaBlocks.map((block, index) => (
            <KnowledgeAreaBlockForm
              key={block.id}
              block={block}
              onChange={handleKnowledgeAreaBlockChange}
              onGenerate={generateSingleKnowledgeAreaBlock}
              onRemove={removeKnowledgeAreaBlock}
              isLoading={block.isLoading || isGeneratingAll}
              blockNumber={index + 1}
              availableAreas={formData.referentialData.areas} // Pass available areas
              nivel={formData.referentialData.nivel} // Pass nivel
              anioEscolaridad={formData.referentialData.anioEscolaridad} // Pass anioEscolaridad
            />
          ))}
          {/* Removed "Añadir Bloque de Área de Saberes" button as blocks are now dynamically generated */}
        </section>

        <section className="border-pdc p-0 mb-8 overflow-x-auto">
          <h3 className="text-md font-bold p-2 bg-gray-100 border-pdc-b text-center">ADAPTACIONES CURRICULARES SIGNIFICATIVAS</h3>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-700">
                <th className="p-2 border-pdc-b border-pdc-r w-1/5">Contenido</th>
                <th className="p-2 border-pdc-b border-pdc-r w-1/4">Discapacidad/Talento extraordinario/TDH/TEA y otros</th>
                <th className="p-2 border-pdc-b border-pdc-r w-1/4">Adaptación</th>
                <th className="p-2 border-pdc-b border-pdc-r w-1/4">Criterio de evaluación</th>
                <th className="p-2 border-pdc-b w-20">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {formData.significantAdaptations.map((adaptation, index) => (
                <SignificantAdaptationForm
                  key={adaptation.id}
                  adaptation={adaptation}
                  onChange={handleSignificantAdaptationChange}
                  onGenerate={generateSingleSignificantAdaptation}
                  onRemove={removeSignificantAdaptation}
                  isLoading={adaptation.isLoading || isGeneratingAll}
                  index={index}
                />
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4 p-2 border-pdc-t">
            <Button onClick={addSignificantAdaptation} variant="secondary" size="sm">
              Añadir Adaptación Curricular
            </Button>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-blue-700 p-4 text-white shadow-lg flex justify-center items-center gap-4 z-50">
        <Button onClick={generateAllContent} isLoading={isGeneratingAll} disabled={isGeneratingAll || isDownloadingWord} size="lg">
          {isGeneratingAll ? <LoadingSpinner message="Generando todo el PDC..." className="text-blue-200" /> : 'Generar PDC Completo con IA'}
        </Button>
        <Button onClick={handleDownloadWord} isLoading={isDownloadingWord} disabled={isDownloadingWord || isGeneratingAll} variant="secondary" size="lg">
          {isDownloadingWord ? <LoadingSpinner message="Descargando Word..." className="text-gray-600" /> : 'Descargar Word'}
        </Button>
        {/* Removed PDF download button */}
        { (isGeneratingAll || isDownloadingWord) && <span className="text-sm">Esto puede tomar un momento...</span>}
      </div>
    </div>
  );
};

export default App;