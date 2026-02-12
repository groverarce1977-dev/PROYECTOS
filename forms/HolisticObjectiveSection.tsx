import React from 'react';
import Textarea from '../ui/Textarea';

interface HolisticObjectiveSectionProps {
  objetivo: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const HolisticObjectiveSection: React.FC<HolisticObjectiveSectionProps> = ({ objetivo, onChange }) => {
  return (
    <div className="border-pdc p-4 mb-8">
      <h2 className="text-lg font-bold mb-4 text-center">2. DESARROLLO</h2>
      <Textarea
        label="Objetivo holístico de nivel"
        id="objetivoHolisticoNivel"
        name="objetivoHolisticoNivel"
        value={objetivo}
        onChange={onChange}
        rows={6}
      />
    </div>
  );
};

export default HolisticObjectiveSection;