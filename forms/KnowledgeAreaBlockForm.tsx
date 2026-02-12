import React from 'react';
import { KnowledgeAreaBlock, CurricularContent, CriteriaEvaluacion } from '../types';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import LoadingSpinner from '../common/LoadingSpinner';

interface KnowledgeAreaBlockFormProps {
  block: KnowledgeAreaBlock;
  onChange: (id: string, field: string, value: string | CurricularContent | CriteriaEvaluacion) => void;
  onGenerate: (id: string) => Promise<void>;
  onRemove: (id: string) => void;
  isLoading: boolean;
  blockNumber: number;
  availableAreas: string[]; // New prop for areas selected in ReferentialDataForm
  nivel: string; // New prop for selected nivel
  anioEscolaridad: string; // New prop for selected anioEscolaridad
}

const KnowledgeAreaBlockForm: React.FC<KnowledgeAreaBlockFormProps> = ({
  block,
  onChange,
  onGenerate,
  onRemove,
  isLoading,
  blockNumber,
  availableAreas,
  nivel,
  anioEscolaridad,
}) => {
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange(block.id, 'contenidos', { ...block.contenidos, [name]: value });
  };

  const handleCriteriosChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange(block.id, 'criteriosEvaluacion', { ...block.criteriosEvaluacion, [name]: value });
  };

  return (
    <div className="border-pdc-b mb-8 last:mb-0">
      <div className="text-center font-semibold text-md mb-2 p-2 bg-gray-100 border-pdc-t border-pdc-l border-pdc-r">
        <label htmlFor={`areaName-${block.id}`} className="block text-sm font-medium text-gray-700 mb-1">
          Área de saberes y conocimientos:
        </label>
        <select
          id={`areaName-${block.id}`}
          name="areaName"
          value={block.areaName}
          onChange={(e) => onChange(block.id, e.target.name, e.target.value)}
          disabled={!nivel || !anioEscolaridad || availableAreas.length === 0}
          className="inline-block w-auto text-center font-normal px-2 py-0 border-pdc-b border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-1"
        >
          <option value="">
            {(!nivel || !anioEscolaridad) ? "Seleccione nivel y año" : (availableAreas.length === 0 ? "No hay áreas seleccionadas" : "Seleccione un área")}
          </option>
          {availableAreas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-12 auto-rows-min gap-0 text-sm border-pdc-l border-pdc-r">
        {/* Headers */}
        <div className="col-span-2 p-2 font-semibold border-pdc-b border-pdc-r">Objetivo de aprendizaje</div>
        <div className="col-span-2 p-2 font-semibold border-pdc-b border-pdc-r">Contenidos</div>
        <div className="col-span-3 p-2 font-semibold border-pdc-b border-pdc-r">Momentos del proceso formativo</div>
        <div className="col-span-1 p-2 font-semibold border-pdc-b border-pdc-r">Recursos</div>
        <div className="col-span-1 p-2 font-semibold border-pdc-b border-pdc-r">Periodos</div>
        <div className="col-span-3 p-2 font-semibold border-pdc-b">Criterios de evaluación</div>

        {/* Content Rows */}
        <Textarea
          label=""
          id={`objectiveAprendizaje-${block.id}`}
          name="objectiveAprendizaje"
          value={block.objectiveAprendizaje}
          onChange={(e) => onChange(block.id, e.target.name, e.target.value)}
          rows={5}
          className="col-span-2 p-1 border-pdc-r focus:border-blue-500 min-h-[100px]"
          containerClassName="col-span-2 p-0 border-pdc-r"
          isOptional /* Added isOptional prop */
        />

        <div className="col-span-2 p-0 border-pdc-r flex flex-col justify-stretch">
          <Textarea label="" id={`week1-${block.id}`} name="week1" value={block.contenidos.week1} onChange={handleContentChange} rows={1} placeholder="Semana 1" className="p-1 border-pdc-b focus:border-blue-500" containerClassName="p-0 border-pdc-b flex-1" />
          <Textarea label="" id={`week2-${block.id}`} name="week2" value={block.contenidos.week2} onChange={handleContentChange} rows={1} placeholder="Semana 2" className="p-1 border-pdc-b focus:border-blue-500" containerClassName="p-0 border-pdc-b flex-1" />
          <Textarea label="" id={`week3-${block.id}`} name="week3" value={block.contenidos.week3} onChange={handleContentChange} rows={1} placeholder="Semana 3" className="p-1 border-pdc-b focus:border-blue-500" containerClassName="p-0 border-pdc-b flex-1" />
          <Textarea label="" id={`week4-${block.id}`} name="week4" value={block.contenidos.week4} onChange={handleContentChange} rows={1} placeholder="Semana 4" className="p-1 focus:border-blue-500" containerClassName="p-0 flex-1" />
        </div>

        <Textarea
          label=""
          id={`momentosProcesoFormativo-${block.id}`}
          name="momentosProcesoFormativo"
          value={block.momentosProcesoFormativo}
          onChange={(e) => onChange(block.id, e.target.name, e.target.value)}
          rows={5}
          className="col-span-3 p-1 border-pdc-r focus:border-blue-500 min-h-[100px]"
          containerClassName="col-span-3 p-0 border-pdc-r"
          isOptional
        />
        <Textarea
          label=""
          id={`recursos-${block.id}`}
          name="recursos"
          value={block.recursos}
          onChange={(e) => onChange(block.id, e.target.name, e.target.value)}
          rows={5}
          className="col-span-1 p-1 border-pdc-r focus:border-blue-500 min-h-[100px]"
          containerClassName="col-span-1 p-0 border-pdc-r"
          isOptional
        />
        <Textarea
          label=""
          id={`periodos-${block.id}`}
          name="periodos"
          value={block.periodos}
          onChange={(e) => onChange(block.id, e.target.name, e.target.value)}
          rows={5}
          className="col-span-1 p-1 border-pdc-r focus:border-blue-500 min-h-[100px]"
          containerClassName="col-span-1 p-0 border-pdc-r"
          isOptional
        />

        <div className="col-span-3 p-0 flex flex-col justify-stretch">
          <Textarea label="" id={`ser-${block.id}`} name="ser" value={block.criteriosEvaluacion.ser} onChange={handleCriteriosChange} rows={1} placeholder="SER:" className="p-1 border-pdc-b focus:border-blue-500" containerClassName="p-0 border-pdc-b flex-1" isOptional />
          <Textarea label="" id={`saber-${block.id}`} name="saber" value={block.criteriosEvaluacion.saber} onChange={handleCriteriosChange} rows={1} placeholder="SABER:" className="p-1 border-pdc-b focus:border-blue-500" containerClassName="p-0 border-pdc-b flex-1" isOptional />
          <Textarea label="" id={`hacer-${block.id}`} name="hacer" value={block.criteriosEvaluacion.hacer} onChange={handleCriteriosChange} rows={1} placeholder="HACER:" className="p-1 focus:border-blue-500" containerClassName="p-0 flex-1" isOptional />
        </div>

        {/* Adaptaciones Curriculares row */}
        <div className="col-span-full border-pdc-t p-0">
          <Textarea
            label="ADAPTACIONES CURRICULARES (estudiantes con: dificultades en el aprendizaje (generales y específicos), o ritmos de aprendizaje distinto y otros)."
            id={`curricularAdaptations-${block.id}`}
            name="curricularAdaptations"
            value={block.contenidos.curricularAdaptations}
            onChange={handleContentChange}
            rows={2}
            className="w-full p-1 focus:border-blue-500 text-xs"
            containerClassName="col-span-full p-0"
            isOptional
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-2 p-2 bg-gray-50 border-pdc-l border-pdc-r border-pdc-b">
        <Button onClick={() => onGenerate(block.id)} isLoading={isLoading} disabled={isLoading} size="sm" variant="secondary">
          {isLoading ? 'Generando...' : 'Generar Contenido con IA'}
        </Button>
        <Button onClick={() => onRemove(block.id)} variant="danger" size="sm" disabled={isLoading}>
          Eliminar Bloque
        </Button>
      </div>
    </div>
  );
};

export default KnowledgeAreaBlockForm;