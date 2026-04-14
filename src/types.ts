export type ObjectType = 'text' | 'image' | 'shape' | 'chart' | 'logo';

export interface AtomicObject {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  content: any; // Specific to type
  style: {
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
    fontFamily?: string;
    opacity?: number;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: string;
    [key: string]: any;
  };
}

export interface BrandKit {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontSans: string;
  fontDisplay: string;
  logoUrl?: string;
}

export interface GeneratorTool {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'marketing' | 'business' | 'creative' | 'technical';
}
