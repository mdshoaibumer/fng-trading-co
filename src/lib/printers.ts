import printersData from './printers.json';

export interface Printer {
  id: string;
  name: string;
  descEn: string;
  descAr: string;
  featuresEn: string[];
  featuresAr: string[];
  images: string[];
  specsEn: Record<string, string>;
  specsAr: Record<string, string>;
  available?: boolean;
}

export const PRINTERS: Printer[] = (printersData as unknown) as Printer[];
