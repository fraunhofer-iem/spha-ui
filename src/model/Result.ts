export interface Kpi {
    displayName: string;
    score: number;
    id: string;
    children: Kpi[]
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

export interface Tool {
    name: string;
    scanDate?: string;
    findings?: number;
    downloadLink: string;
    icon?: string;
    description?: string;
}

export interface Result {
    healthScore: number;
    repoInfo: RepoInfo;
    root: Kpi
    tools: Tool[]
}

