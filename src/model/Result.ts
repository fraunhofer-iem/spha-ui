export interface Threshold {
  name: string;
  value: number;
}

export interface Kpi {
  displayName: string;
  score: number;
  id: string;
  children: Kpi[];
  thresholds?: Threshold[];
}

export interface RepoInfo {
  stars?: number;
  lastCommitDate?: string;
  contributors?: number;
  projectUrl?: string;
  projectName?: string;
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
  icon?: string;
  description?: string;
}

export interface Result {
  healthScore: number;
  repoInfo: RepoInfo;
  root: Kpi;
  tools: Tool[];
}
