import React from 'react';
import { SignificantAdaptation } from '../types';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import LoadingSpinner from '../common/LoadingSpinner';

interface SignificantAdaptationFormProps {
  adaptation: SignificantAdaptation;
  onChange: (id: string, field: string, value: string) => void;
  onGenerate: (id: string) => Promise<void>;
  onRemove: (id: string) => void;
  isLoading: boolean;
  index: number;
}

const SignificantAdaptationForm: React.FC<SignificantAdaptationFormProps> = ({
  adaptation,
  onChange,
  onGenerate,
  onRemove,
  isLoading,
  index,
}) => {
  return (
    <tr className="border-pdc-b">
      <td className="p-1 border-pdc-r w-1/5">
        <Textarea
          label=""
          id={`contenido-${adaptation.id}`}
          name="contenido"
          value={adaptation.contenido}
          onChange={(e) => onChange(adaptation.id, e.target.name, e.target.value)}
          rows={1}
          className="w-full p-1 focus:border-blue-500"
          containerClassName="p-0"
          placeholder={`Estudiante ${index + 1}`}
        />
      </td>
      <td className="p-1 border-pdc-r w-1/4">
        <Textarea
          label=""
          id={`discapacidadTalentoOtros-${adaptation.id}`}
          name="discapacidadTalentoOtros"
          value={adaptation.discapacidadTalentoOtros}
          onChange={(e) => onChange(adaptation.id, e.target.name, e.target.value)}
          rows={1}
          className="w-full p-1 focus:border-blue-500"
          containerClassName="p-0"
          isOptional
        />
      </td>
      <td className="p-1 border-pdc-r w-1/4 relative">
        <Textarea
          label=""
          id={`adaptacion-${adaptation.id}`}
          name="adaptacion"
          value={adaptation.adaptacion}
          onChange={(e) => onChange(adaptation.id, e.target.name, e.target.value)}
          rows={1}
          className="w-full p-1 focus:border-blue-500"
          containerClassName="p-0"
          isOptional
        />
        {isLoading && <LoadingSpinner className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center text-xs" message="Generando..." />}
      </td>
      <td className="p-1 w-1/4 relative">
        <Textarea
          label=""
          id={`criterioEvaluacion-${adaptation.id}`}
          name="criterioEvaluacion"
          value={adaptation.criterioEvaluacion}
          onChange={(e) => onChange(adaptation.id, e.target.name, e.target.value)}
          rows={1}
          className="w-full p-1 focus:border-blue-500"
          containerClassName="p-0"
          isOptional
        />
        {isLoading && <LoadingSpinner className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center text-xs" message="Generando..." />}
      </td>
      <td className="p-1 w-20 text-center flex flex-col justify-center items-center gap-1 border-pdc-l">
        <Button onClick={() => onGenerate(adaptation.id)} isLoading={isLoading} disabled={isLoading} size="sm" variant="secondary" className="w-full text-[10px] py-0.5">
          {isLoading ? 'Gen...' : 'Generar'}
        </Button>
        <Button onClick={() => onRemove(adaptation.id)} variant="danger" size="sm" disabled={isLoading} className="w-full text-[10px] py-0.5">
          Eliminar
        </Button>
      </td>
    </tr>
  );
};

export default SignificantAdaptationForm;