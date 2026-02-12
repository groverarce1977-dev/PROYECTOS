import { Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle, ISectionOptions, convertInchesToTwip, ITableOptions, PageOrientation, LineRuleType, ShadingType, VerticalAlign } from 'docx';
import saveAs from 'file-saver';
import { PDCFormData } from '../types';

const generatePDCWordDocument = async (formData: PDCFormData) => {
  const doc = new Document({
    // REVERT: Replaced 'styles' with 'initialStyles' to revert to the state before PDF-related changes.
    initialStyles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: "Arial",
            size: 20, // 10pt = 20 half-points
          },
          paragraph: {
            spacing: {
              before: 0,
              after: 0,
              line: 276, // 1.15 line spacing (1.15 * 240)
              lineRule: LineRuleType.AUTO,
            },
          },
        },
        {
          id: "Heading1", // Custom style for main title
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: "Arial",
            size: 28, // 14pt = 28 half-points
            bold: true,
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 0, line: 276, lineRule: LineRuleType.AUTO },
          },
        },
        {
          id: "Heading2", // Custom style for section titles
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: "Arial",
            size: 24, // 12pt = 24 half-points
            bold: true,
          },
          paragraph: {
            alignment: AlignmentType.LEFT,
            spacing: { before: 0, after: 0, line: 276, lineRule: LineRuleType.AUTO },
          },
        },
        {
          id: "Heading3", // Custom style for sub-section titles (like Area and Holistic Objective)
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: "Arial",
            size: 22, // 11pt = 22 half-points
            bold: true,
          },
          paragraph: {
            alignment: AlignmentType.LEFT,
            spacing: { before: 100, after: 0, line: 276, lineRule: LineRuleType.AUTO }, // Small space before
          },
        },
      ],
    },
    sections: [
      createHeaderSection(formData.referentialData.nivel),
      createReferentialDataSection(formData.referentialData),
      createHolisticObjectiveSection(formData.objetivoHolisticoNivel, formData.referentialData.nivel),
      ...createKnowledgeAreaBlocksSections(formData.knowledgeAreaBlocks),
      createSignificantAdaptationsSection(formData.significantAdaptations),
    ].map(section => ({
      ...section,
      properties: {
        page: {
          orientation: PageOrientation.LANDSCAPE, // Keep landscape as requested
          margin: {
            top: convertInchesToTwip(0.98), // 2.5 cm
            right: convertInchesToTwip(1.18), // 3 cm
            bottom: convertInchesToTwip(0.98), // 2.5 cm
            left: convertInchesToTwip(1.18), // 3 cm
          },
        },
      },
    })),
  });

  try {
    const blob = await new Promise<Blob>((resolve) => {
      import('docx').then(({ Packer }) => {
        Packer.toBlob(doc).then(resolve);
      });
    });
    saveAs(blob, 'Plan_Desarrollo_Curricular.docx');
  } catch (error) {
    console.error('Error al generar el documento de Word:', error);
    throw new Error('No se pudo generar el documento de Word. Inténtalo de nuevo.');
  }
};

function getNivelTitle(nivel: string) {
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
}

function createHeaderSection(nivel: string): ISectionOptions {
  return {
    children: [
      new Paragraph({
        children: [new TextRun({ text: getNivelTitle(nivel).toUpperCase() })], // Ensure uppercase for main title
        style: "Heading1", // Use custom Heading1 style
      }),
      new Paragraph({
        children: [new TextRun({ text: 'PLAN DE DESARROLLO CURRICULAR Nº 1', bold: true, size: 28 })], // 14pt
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }, // Small space after main title
      }),
    ],
  };
}

function createReferentialDataSection(data: PDCFormData['referentialData']): ISectionOptions {
  return {
    children: [
      new Paragraph({
        children: [new TextRun({ text: '1. DATOS REFERENCIALES', bold: true })],
        style: "Heading2", // Use custom Heading2 style
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Distrito educativo: ', bold: true }),
          new TextRun({ text: data.distritoEducativo || '—' }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Unidad educativa: ', bold: true }),
          new TextRun({ text: data.unidadEducativa || '—' }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Nivel: ', bold: true }),
          new TextRun({ text: data.nivel || '—' }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Año de escolaridad: ', bold: true }),
          new TextRun({ text: data.anioEscolaridad || '—' }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Director/a: ', bold: true }),
          new TextRun({ text: data.directora || '—' }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Maestro/a: ', bold: true }),
          new TextRun({ text: data.maestra || '—' }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Áreas: ', bold: true }),
          new TextRun({ text: data.areas.length > 0 ? data.areas.join(', ') : '—' }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Trimestre: Del ', bold: true }),
          new TextRun({ text: data.trimestreDel || '—' }),
          new TextRun({ text: ' al ', bold: true }),
          new TextRun({ text: data.trimestreAl || '—' }),
        ],
        spacing: { after: 100 }, // Small space before next section
      }),
    ],
  };
}

function getHolisticObjectiveSectionTitle(nivel: string): string {
  switch (nivel) {
    case 'Inicial':
      return 'OBJETIVO HOLÍSTICO DEL NIVEL DE EDUCACIÓN INICIAL EN FAMILIA COMUNITARIA';
    case 'Primaria':
      return 'OBJETIVO HOLÍSTICO DEL NIVEL DE EDUCACIÓN PRIMARIA COMUNITARIA VOCACIONAL';
    case 'Secundaria':
      return 'OBJETIVO HOLÍSTICO DEL NIVEL DE EDUCACIÓN SECUNDARIA COMUNITARIA PRODUCTIVA';
    default:
      return 'OBJETIVO HOLÍSTICO DE NIVEL';
  }
}

function createHolisticObjectiveSection(objective: string, nivel: string): ISectionOptions {
  const dynamicTitle = getHolisticObjectiveSectionTitle(nivel);
  const tableBorderOptions = {
    top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
  };

  return {
    children: [
      new Paragraph({
        children: [new TextRun({ text: '2. DESARROLLO', bold: true })],
        style: "Heading2",
      }),
      new Paragraph({
        children: [new TextRun({ text: dynamicTitle, bold: true })],
        style: "Heading3",
      }),
      new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: objective || '—', size: 20 }) // Arial 10pt
                    ],
                    alignment: AlignmentType.BOTH, // Justified
                  }),
                ],
                borders: tableBorderOptions,
                shading: {
                  type: ShadingType.SOLID,
                  color: 'auto',
                  fill: 'F2F2F2', // Light gray fill (sombreado al 10%)
                },
                verticalAlign: VerticalAlign.TOP,
              }),
            ],
          }),
        ],
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBorderOptions,
      } as ITableOptions),
      new Paragraph({ spacing: { after: 100 } }), // Single space after the box
    ],
  };
}

function createKnowledgeAreaBlocksSections(blocks: PDCFormData['knowledgeAreaBlocks']): ISectionOptions[] {
  const sections: ISectionOptions[] = [];
  const tableBorderOptions = {
    top: { style: BorderStyle.SINGLE, size: 4, color: '000000' }, // 0.5 pt
    bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    insideVertical: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
  };

  blocks.forEach((block) => {
    sections.push({
      children: [
        new Paragraph({
          children: [new TextRun({ text: `ÁREA DE SABERES Y CONOCIMIENTOS: ${block.areaName || '—'}`, bold: true })],
          style: "Heading3",
        }),
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: 'Objetivo de aprendizaje', bold: true, size: 20 })] })], // 10pt
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  borders: tableBorderOptions,
                  verticalAlign: VerticalAlign.TOP,
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: 'Contenidos', bold: true, size: 20 })] })],
                  width: { size: 15, type: WidthType.PERCENTAGE },
                  borders: tableBorderOptions,
                  verticalAlign: VerticalAlign.TOP,
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: 'Momentos del proceso formativo', bold: true, size: 20 })] })],
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  borders: tableBorderOptions,
                  verticalAlign: VerticalAlign.TOP,
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: 'Recursos', bold: true, size: 20 })] })],
                  width: { size: 12, type: WidthType.PERCENTAGE },
                  borders: tableBorderOptions,
                  verticalAlign: VerticalAlign.TOP,
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: 'Periodos', bold: true, size: 20 })] })],
                  width: { size: 6, type: WidthType.PERCENTAGE },
                  borders: tableBorderOptions,
                  verticalAlign: VerticalAlign.TOP,
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: 'Criterios de evaluación (SER, SABER, HACER)', bold: true, size: 20 })] })],
                  width: { size: 12, type: WidthType.PERCENTAGE },
                  borders: tableBorderOptions,
                  verticalAlign: VerticalAlign.TOP,
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: block.objectiveAprendizaje || '—', size: 20 })] })],
                  borders: tableBorderOptions,
                  verticalAlign: VerticalAlign.TOP,
                }),
                new TableCell({
                  children: [
                    new Paragraph({ children: [new TextRun({ text: '• Semana 1: ', bold: true, size: 20 }), new TextRun({ text: block.contenidos.week1 || '—', size: 20 })] }),
                    new Paragraph({ children: [new TextRun({ text: '• Semana 2: ', bold: true, size: 20 }), new TextRun({ text: block.contenidos.week2 || '—', size: 20 })] }),
                    new Paragraph({ children: [new TextRun({ text: '• Semana 3: ', bold: true, size: 20 }), new TextRun({ text: block.contenidos.week3 || '—', size: 20 })] }),
                    new Paragraph({ children: [new TextRun({ text: '• Semana 4: ', bold: true, size: 20 }), new TextRun({ text: block.contenidos.week4 || '—', size: 20 })] }),
                    new Paragraph({ children: [new TextRun({ text: 'Adaptaciones Curriculares (generales y específicos): ', bold: true, size: 20 }), new TextRun({ text: block.contenidos.curricularAdaptations || '—', size: 20 })] }),
                  ],
                  borders: tableBorderOptions,
                  verticalAlign: VerticalAlign.TOP,
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: block.momentosProcesoFormativo || '—', size: 20 })] })],
                  borders: tableBorderOptions,
                  verticalAlign: VerticalAlign.TOP,
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: block.recursos || '—', size: 20 })] })],
                  borders: tableBorderOptions,
                  verticalAlign: VerticalAlign.TOP,
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: block.periodos || '—', size: 20 })] })],
                  borders: tableBorderOptions,
                  verticalAlign: VerticalAlign.TOP,
                }),
                new TableCell({
                  children: [
                    new Paragraph({ children: [new TextRun({ text: 'SER: ', bold: true, size: 20 }), new TextRun({ text: block.criteriosEvaluacion.ser || '—', size: 20 })] }),
                    new Paragraph({ children: [new TextRun({ text: 'SABER: ', bold: true, size: 20 }), new TextRun({ text: block.criteriosEvaluacion.saber || '—', size: 20 })] }),
                    new Paragraph({ children: [new TextRun({ text: 'HACER: ', bold: true, size: 20 }), new TextRun({ text: block.criteriosEvaluacion.hacer || '—', size: 20 })] }),
                  ],
                  borders: tableBorderOptions,
                  verticalAlign: VerticalAlign.TOP,
                }),
              ],
            }),
          ],
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: tableBorderOptions,
        } as ITableOptions),
        new Paragraph({ spacing: { after: 100 } }), // Small space after each area block
      ],
    });
  });
  return sections;
}

function createSignificantAdaptationsSection(adaptations: PDCFormData['significantAdaptations']): ISectionOptions {
  const tableBorderOptions = {
    top: { style: BorderStyle.SINGLE, size: 4, color: '000000' }, // 0.5 pt
    bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    insideVertical: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
  };

  const tableRows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Contenido', bold: true, size: 20 })] })], width: { size: 25, type: WidthType.PERCENTAGE }, borders: tableBorderOptions, verticalAlign: VerticalAlign.TOP, }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Discapacidad/Talento extraordinario/TDH/TEA y otros', bold: true, size: 20 })] })], width: { size: 25, type: WidthType.PERCENTAGE }, borders: tableBorderOptions, verticalAlign: VerticalAlign.TOP, }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Adaptación', bold: true, size: 20 })] })], width: { size: 35, type: WidthType.PERCENTAGE }, borders: tableBorderOptions, verticalAlign: VerticalAlign.TOP, }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Criterio de evaluación', bold: true, size: 20 })] })], width: { size: 15, type: WidthType.PERCENTAGE }, borders: tableBorderOptions, verticalAlign: VerticalAlign.TOP, }),
      ],
    }),
    ...adaptations.map((adaptation) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: adaptation.contenido || '—', size: 20 })] })], borders: tableBorderOptions, verticalAlign: VerticalAlign.TOP, }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: adaptation.discapacidadTalentoOtros || '—', size: 20 })] })], borders: tableBorderOptions, verticalAlign: VerticalAlign.TOP, }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: adaptation.adaptacion || '—', size: 20 })] })], borders: tableBorderOptions, verticalAlign: VerticalAlign.TOP, }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: adaptation.criterioEvaluacion || '—', size: 20 })] })], borders: tableBorderOptions, verticalAlign: VerticalAlign.TOP, }),
        ],
      })
    ),
  ];

  return {
    children: [
      new Paragraph({
        children: [new TextRun({ text: 'ADAPTACIONES CURRICULARES SIGNIFICATIVAS', bold: true })],
        style: "Heading2",
        spacing: { before: 100 }, // Small space before this section
      }),
      new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBorderOptions,
      } as ITableOptions),
      new Paragraph({ spacing: { after: 100 } }), // Small space at the end of the document
    ],
  };
}

export default generatePDCWordDocument;