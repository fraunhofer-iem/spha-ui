import type {
  Kpi,
  RepoInfo,
  Result,
  Tool,
  ToolInfoAndOrigin,
  Threshold,
} from "../model/Result.ts";

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
    version: raw.projectInfo.version ?? "N/A",
    repoLanguages: raw.projectInfo.usedLanguages ?? {
      name: "N/A",
      percentage: 100,
    },
  };

  const healthScore = extractScore(raw.resultHierarchy.root?.result) ?? -1;
  const tools: Tool[] = raw.origins.map((toolAndOrigin: ToolInfoAndOrigin) => {
    return {
      name: toolAndOrigin.toolInfo?.name ?? "N/A",
      findings: toolAndOrigin.origins ?? [],
      downloadLink: "N/A", //TODO: derive from name / store findings and make them downloadable
      icon: "", // TODO: derive icon from name
      description: toolAndOrigin.toolInfo?.description ?? "", // Use description from toolInfo
    };
  });

  const root: Kpi = nodeToKpi(raw.resultHierarchy.root);

  return {
    healthScore,
    repoInfo,
    root,
    tools,
    createdAt: new Date().toISOString(),
  };
}

function nodeToKpi(node: any): Kpi {
  const thresholds: Threshold[] | undefined = node.thresholds?.map(
    (threshold: any) => ({
      name: threshold.name ?? "unknown",
      value: threshold.value ?? 0,
    }),
  );

  return {
    displayName: node.metaInfo.displayName ?? "N/a", // TODO: derive name from typeId
    score: extractScore(node.result) ?? -1,
    resultType: node.result?.type,
    id: node.typeId ?? "N/A",
    children: node.edges?.map((edge: any) => nodeToKpi(edge.target)) ?? [],
    thresholds: thresholds?.length ? thresholds : undefined,
    description: node.metaInfo.description,
    tags: node.metaInfo.tags,
  };
}

function extractScore(result: any): number | undefined {
  if (!result) return undefined;

  // Handle direct score (legacy format)
  if (typeof result.score === "number") {
    return result.score;
  }

  // Handle Kotlin sealed class format
  if (result.type && result.score !== undefined) {
    return result.score;
  }

  return undefined;
}
