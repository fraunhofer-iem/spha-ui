export interface Threshold {
  name: string;
  value: number;
}

export interface Kpi {
  displayName: string;
  score: number;
  resultType?: string;
  id: string;
  children: Kpi[];
  thresholds?: Threshold[];
  description?: string;
  tags?: string[];
}

export interface RepoInfo {
  stars?: number;
  lastCommitDate?: string;
  contributors?: number;
  projectUrl?: string;
  projectName?: string;
  version?: string;
  repoLanguages: Language[];
}

export interface Language {
  name: string;
  size: number;
}

export interface ToolInfo {
  name: string;
  description: string;
  version?: string;
}

export interface ToolInfoAndOrigin {
  toolInfo: ToolInfo;
  origins: any[];
}

export interface Tool {
  name: string;
  scanDate?: string;
  findings?: any[];
  description?: string;
}

export interface Result {
  healthScore: number;
  repoInfo: RepoInfo;
  root: Kpi;
  tools: Tool[];
  createdAt: string; // defaults to upload date
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  version?: string;
  results: Result[];
  createdAt?: string;
  // TODO: add product group
}
