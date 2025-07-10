import type {Kpi, RepoInfo, Result, Tool} from "../model/Result.ts";

export function parse(raw: any): Result | undefined {

    if (!raw.resultHierarchy || !raw.origins || !raw.projectInfo) {
        return undefined;
    }

    const repoInfo: RepoInfo = {
        stars: raw.projectInfo.stars ?? -1,
        lastCommitDate: raw.projectInfo.lastCommitDate ?? "N/A",
        contributors: raw.projectInfo.numberOfContributors ?? -1,
        projectUrl: raw.projectInfo.url ?? "N/A",
        projectName: raw.projectInfo.name ?? "N/A",
        repoLanguages: raw.projectInfo.usedLanguages ?? {
            name: "N/A",
            percentage: 100
        }
    }

    const healthScore = raw.resultHierarchy.root?.result?.score ?? -1
    const tools: Tool[] = raw.origins.map((origin: any) => {
        return {
            name: origin.name ?? "N/A",
            findings: origin.origin.size ?? 0,
            downloadLink: "N/A", //TODO: derive from name / store findings and make them downloadable
            icon: "", // TODO: derive icon from name
            description: "" // TODO: derive description from tool name
        }
    })

    const root: Kpi = nodeToKpi(raw.resultHierarchy.root)

    return {
        healthScore,
        repoInfo,
        root,
        tools
    };
}

function nodeToKpi(node: any): Kpi {
    return {
        name: node.typeId ?? "N/a", // TODO: derive name from typeId
        score: node.result.score ?? -1,
        id: node.id ?? "N/A",
        children: node.children?.map(nodeToKpi) ?? []
    }
}