import React from 'react';
import { ReferentialData } from '../types';
import Input from '../ui/Input';
import { AREAS_BY_NIVEL } from '../constants'; // Import the new constant

interface ReferentialDataFormProps {
  data: ReferentialData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | { name: string, value: string | string[] }>) => void;
}

const ReferentialDataForm: React.FC<ReferentialDataFormProps> = ({ data, onChange }) => {
  const niveles = ['Inicial', 'Primaria', 'Secundaria'];
  const aniosEscolaridad = ['1ro', '2do', '3ro', '4to', '5to', '6to'];
  const availableAreas = data.nivel ? AREAS_BY_NIVEL[data.nivel] : [];

  const handleAreasCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let updatedAreas: string[];

    if (checked) {
      updatedAreas = [...data.areas, value];
    } else {
      updatedAreas = data.areas.filter((area) => area !== value);
    }

    // Create a synthetic event object similar to what onChange expects
    const syntheticEvent = {
      target: {
        name: 'areas',
        value: updatedAreas,
      },
    } as React.ChangeEvent<{ name: string; value: string | string[] }>; // Cast to match modified onChange prop type
    onChange(syntheticEvent);
  };

  return (
    <div className="border-pdc p-4 mb-8">
      <h2 className="text-lg font-bold mb-4 text-center">1. DATOS REFERENCIALES</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        <Input
          label="Distrito educativo"
          id="distritoEducativo"
          name="distritoEducativo"
          value={data.distritoEducativo}
          onChange={onChange}
        />
        <Input
          label="Unidad educativa"
          id="unidadEducativa"
          name="unidadEducativa"
          value={data.unidadEducativa}
          onChange={onChange}
        />
        <div className="flex flex-col">
          <label htmlFor="nivel" className="block text-sm font-medium text-gray-700 mb-1">
            Nivel
          </label>
          <select
            id="nivel"
            name="nivel"
            value={data.nivel}
            onChange={onChange}
            className="mt-1 block w-full border-pdc-b border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-1"
          >
            <option value="">Seleccione un nivel</option>
            {niveles.map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="anioEscolaridad" className="block text-sm font-medium text-gray-700 mb-1">
            Año de escolaridad
          </label>
          <select
            id="anioEscolaridad"
            name="anioEscolaridad"
            value={data.anioEscolaridad}
            onChange={onChange}
            className="mt-1 block w-full border-pdc-b border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-1"
          >
            <option value="">Seleccione un año</option>
            {aniosEscolaridad.map((anio) => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Director/a"
          id="directora"
          name="directora"
          value={data.directora}
          onChange={onChange}
        />
        <Input
          label="Maestro/a"
          id="maestra"
          name="maestra"
          value={data.maestra}
          onChange={onChange}
        />
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="areas" className="block text-sm font-medium text-gray-700 mb-1">
            Áreas
          </label>
          <div className={`mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 border-pdc-b border-gray-300 ${!data.nivel ? 'bg-gray-100 text-gray-500' : ''}`}>
            {data.nivel ? (
              availableAreas.map((area) => (
                <div key={area} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`area-${area}`}
                    name="areas"
                    value={area}
                    checked={data.areas.includes(area)}
                    onChange={handleAreasCheckboxChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`area-${area}`} className="ml-2 block text-sm text-gray-900">
                    {area}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 col-span-full">Seleccione un nivel para ver las áreas disponibles.</p>
            )}
          </div>
          {data.nivel && availableAreas.length === 0 && (
            <p className="text-xs text-gray-500 mt-1">No hay áreas definidas para el nivel seleccionado.</p>
          )}
        </div>
        <div className="flex items-end gap-2 md:col-span-2">
          <Input
            label="Trimestre Del:"
            id="trimestreDel"
            name="trimestreDel"
            value={data.trimestreDel}
            onChange={onChange}
            type="date"
            containerClassName="flex-1"
          />
          <Input
            label="al:"
            id="trimestreAl"
            name="trimestreAl"
            value={data.trimestreAl}
            onChange={onChange}
            type="date"
            containerClassName="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default ReferentialDataForm;