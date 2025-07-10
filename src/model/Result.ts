export interface Kpi {
    name: string;
    score: number;
    id: string;
    children: Kpi[]
}

export interface RepoInfo {
    stars: number;
    lastCommitDate: string;
    contributors: number;
    projectUrl: string;
    projectName: string;
    repoLanguages: {
        name: string;
        percentage: number;
    };
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

