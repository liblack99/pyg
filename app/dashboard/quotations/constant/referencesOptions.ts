export const referencesOptions = [
  {
    label: "Suministro e instalación de",
    value: "Suministro e instalación de",
    needsDetail: true,
  },
  {
    label: "Suministro de",
    value: "Suministro de",
    needsDetail: true,
  },
  {
    label: "Mantenimiento de",
    value: "Mantenimiento de",
    needsDetail: true,
  },
  {
    label: "Instalación de",
    value: "Instalación de",
    needsDetail: true,
  },
  {
    label: "Construcción obra civil",
    value: "Construcción obra civil",
    needsDetail: false,
  },
  {
    label: "Construcción de",
    value: "Construcción de",
    needsDetail: true,
  },
] as const;

export type ReferenceOption = (typeof referencesOptions)[number];
