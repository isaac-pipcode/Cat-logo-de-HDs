export interface Drive {
  id?: number;
  name: string;
  dateScanned: Date;
  totalFiles: number;
  totalSize: number;
}

export interface FileItem {
  id?: number;
  driveId: number;
  driveName: string;
  name: string;
  path: string;
  size: number;
  type: string; // derived from extension
  extension: string;
}

export interface SearchFilters {
  query: string;
  minSize?: number;
  maxSize?: number;
  extensions?: string[];
  driveId?: number | null;
}

export interface ChartData {
  name: string;
  value: number;
}
