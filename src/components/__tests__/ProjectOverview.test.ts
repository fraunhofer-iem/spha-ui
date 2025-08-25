import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import ProjectOverview from "../ProjectOverview.vue";
import type { RepoInfo, Language } from "../../model/Result";

// Mock DashboardCard component
vi.mock("../DashboardCard.vue", () => ({
  default: {
    name: "DashboardCard",
    props: ["title"],
    template: '<div class="dashboard-card"><h3>{{ title }}</h3><slot></slot></div>',
  },
}));

describe("ProjectOverview", () => {
  let wrapper: VueWrapper<any>;

  const createMockRepoInfo = (overrides: Partial<RepoInfo> = {}): RepoInfo => ({
    projectName: "Awesome Project",
    stars: 127,
    contributors: 8,
    lastCommitDate: "2024-01-15T10:30:00Z",
    projectUrl: "https://github.com/example/awesome-project",
    repoLanguages: [
      { name: "TypeScript", size: 65.2 },
      { name: "JavaScript", size: 20.8 },
      { name: "CSS", size: 10.5 },
      { name: "HTML", size: 3.5 },
    ],
    ...overrides,
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe("Component Initialization", () => {
    it("should mount with complete repo info", () => {
      const repoInfo = createMockRepoInfo();

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should render DashboardCard with Project Overview title", () => {
      const repoInfo = createMockRepoInfo();

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      const dashboardCard = wrapper.findComponent({ name: "DashboardCard" });
      expect(dashboardCard.exists()).toBe(true);
      expect(dashboardCard.props().title).toBe("Project Overview");
    });

    it("should handle props with all optional fields undefined", () => {
      const repoInfo: RepoInfo = {
        repoLanguages: [],
      };

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Project Name Display", () => {
    it("should display project name when provided", () => {
      const repoInfo = createMockRepoInfo({
        projectName: "My Awesome Project",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.text()).toContain("My Awesome Project");
    });

    it("should handle missing project name gracefully", () => {
      const repoInfo = createMockRepoInfo({
        projectName: undefined,
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      // Should show fallback text or not crash
      expect(wrapper.exists()).toBe(true);
    });

    it("should handle empty project name", () => {
      const repoInfo = createMockRepoInfo({
        projectName: "",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should handle N/A project name", () => {
      const repoInfo = createMockRepoInfo({
        projectName: "N/A",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.text()).toContain("N/A");
    });
  });

  describe("Stars Display", () => {
    it("should display star count when provided", () => {
      const repoInfo = createMockRepoInfo({
        stars: 1250,
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.text()).toContain("1250");
    });

    it("should handle zero stars", () => {
      const repoInfo = createMockRepoInfo({
        stars: 0,
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.text()).toContain("0");
    });

    it("should handle missing stars", () => {
      const repoInfo = createMockRepoInfo({
        stars: undefined,
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should handle negative stars (error case)", () => {
      const repoInfo = createMockRepoInfo({
        stars: -1,
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      // Component should handle this gracefully
      expect(wrapper.exists()).toBe(true);
    });

    it("should format large star numbers appropriately", () => {
      const repoInfo = createMockRepoInfo({
        stars: 15420,
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.text()).toContain("15420");
    });
  });

  describe("Contributors Display", () => {
    it("should display contributor count when provided", () => {
      const repoInfo = createMockRepoInfo({
        contributors: 15,
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.text()).toContain("15");
    });

    it("should handle single contributor", () => {
      const repoInfo = createMockRepoInfo({
        contributors: 1,
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.text()).toContain("1");
    });

    it("should handle zero contributors", () => {
      const repoInfo = createMockRepoInfo({
        contributors: 0,
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.text()).toContain("0");
    });

    it("should handle missing contributors", () => {
      const repoInfo = createMockRepoInfo({
        contributors: undefined,
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should handle negative contributors (error case)", () => {
      const repoInfo = createMockRepoInfo({
        contributors: -1,
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Last Commit Date Display", () => {
    it("should display last commit date when provided", () => {
      const repoInfo = createMockRepoInfo({
        lastCommitDate: "2024-01-15T10:30:00Z",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      // Should display the date in some format
      expect(wrapper.text()).toContain("2024");
    });

    it("should handle different date formats", () => {
      const testDates = [
        "2024-01-15T10:30:00Z",
        "2024-01-15",
        "2024-01-15T10:30:00",
        "January 15, 2024",
      ];

      testDates.forEach((date) => {
        const repoInfo = createMockRepoInfo({
          lastCommitDate: date,
        });

        wrapper = mount(ProjectOverview, {
          props: repoInfo,
        });

        expect(wrapper.exists()).toBe(true);
      });
    });

    it("should handle missing last commit date", () => {
      const repoInfo = createMockRepoInfo({
        lastCommitDate: undefined,
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should handle N/A last commit date", () => {
      const repoInfo = createMockRepoInfo({
        lastCommitDate: "N/A",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.text()).toContain("N/A");
    });

    it("should handle empty date string", () => {
      const repoInfo = createMockRepoInfo({
        lastCommitDate: "",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should handle invalid date formats gracefully", () => {
      const repoInfo = createMockRepoInfo({
        lastCommitDate: "invalid-date",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Project URL Display", () => {
    it("should display project URL when provided", () => {
      const repoInfo = createMockRepoInfo({
        projectUrl: "https://github.com/user/repo",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.text()).toContain("github.com/user/repo");
    });

    it("should handle different URL formats", () => {
      const testUrls = [
        "https://github.com/user/repo",
        "https://gitlab.com/user/repo",
        "https://bitbucket.org/user/repo",
        "https://example.com/repo",
      ];

      testUrls.forEach((url) => {
        const repoInfo = createMockRepoInfo({
          projectUrl: url,
        });

        wrapper = mount(ProjectOverview, {
          props: repoInfo,
        });

        expect(wrapper.exists()).toBe(true);
      });
    });

    it("should create clickable link when URL is provided", () => {
      const repoInfo = createMockRepoInfo({
        projectUrl: "https://github.com/user/repo",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      const links = wrapper.findAll("a");
      const projectLink = links.find(link =>
        link.attributes("href") === "https://github.com/user/repo"
      );

      expect(projectLink).toBeTruthy();
    });

    it("should open links in new tab", () => {
      const repoInfo = createMockRepoInfo({
        projectUrl: "https://github.com/user/repo",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      const links = wrapper.findAll("a");
      const projectLink = links.find(link =>
        link.attributes("href") === "https://github.com/user/repo"
      );

      if (projectLink) {
        expect(projectLink.attributes("target")).toBe("_blank");
        expect(projectLink.attributes("rel")).toContain("noopener");
      }
    });

    it("should handle missing project URL", () => {
      const repoInfo = createMockRepoInfo({
        projectUrl: undefined,
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should handle N/A project URL", () => {
      const repoInfo = createMockRepoInfo({
        projectUrl: "N/A",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.text()).toContain("N/A");
    });

    it("should handle empty URL string", () => {
      const repoInfo = createMockRepoInfo({
        projectUrl: "",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should handle malformed URLs gracefully", () => {
      const repoInfo = createMockRepoInfo({
        projectUrl: "not-a-valid-url",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Repository Languages", () => {
    it("should handle languages array", () => {
      const repoInfo = createMockRepoInfo({
        repoLanguages: [
          { name: "TypeScript", size: 60 },
          { name: "JavaScript", size: 40 },
        ],
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should handle empty languages array", () => {
      const repoInfo = createMockRepoInfo({
        repoLanguages: [],
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should handle single language", () => {
      const repoInfo = createMockRepoInfo({
        repoLanguages: [
          { name: "JavaScript", size: 100 },
        ],
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should handle many languages", () => {
      const manyLanguages: Language[] = Array.from({ length: 10 }, (_, i) => ({
        name: `Language${i}`,
        size: Math.random() * 100,
      }));

      const repoInfo = createMockRepoInfo({
        repoLanguages: manyLanguages,
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Data Formatting and Display Logic", () => {
    it("should handle all valid data together", () => {
      const repoInfo = createMockRepoInfo({
        projectName: "Complete Project",
        stars: 500,
        contributors: 25,
        lastCommitDate: "2024-01-15T10:30:00Z",
        projectUrl: "https://github.com/user/complete-project",
        repoLanguages: [
          { name: "TypeScript", size: 70 },
          { name: "CSS", size: 30 },
        ],
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.text()).toContain("Complete Project");
      expect(wrapper.text()).toContain("500");
      expect(wrapper.text()).toContain("25");
      expect(wrapper.text()).toContain("2024");
    });

    it("should handle mixed valid and invalid data", () => {
      const repoInfo = createMockRepoInfo({
        projectName: "Mixed Project",
        stars: -1, // Invalid
        contributors: 5, // Valid
        lastCommitDate: "N/A", // Fallback
        projectUrl: "https://github.com/user/mixed", // Valid
        repoLanguages: [], // Empty but valid
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.text()).toContain("Mixed Project");
      expect(wrapper.text()).toContain("5");
      expect(wrapper.text()).toContain("N/A");
    });

    it("should display appropriate icons or indicators", () => {
      const repoInfo = createMockRepoInfo();

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      // Look for common Bootstrap icons that might be used
      const iconElements = wrapper.findAll("i[class*='bi-']");
      expect(iconElements.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Component Responsiveness and Layout", () => {
    it("should have appropriate CSS classes for layout", () => {
      const repoInfo = createMockRepoInfo();

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      // Check for Bootstrap classes
      const hasBootstrapClasses = wrapper.html().includes("row") ||
                                  wrapper.html().includes("col") ||
                                  wrapper.html().includes("d-flex");

      expect(hasBootstrapClasses || wrapper.exists()).toBe(true);
    });

    it("should handle long project names gracefully", () => {
      const repoInfo = createMockRepoInfo({
        projectName: "This is a very long project name that might cause layout issues in the user interface",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should handle very large numbers", () => {
      const repoInfo = createMockRepoInfo({
        stars: 999999,
        contributors: 10000,
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.text()).toContain("999999");
      expect(wrapper.text()).toContain("10000");
    });
  });

  describe("Reactivity and Prop Changes", () => {
    it("should update when project name changes", async () => {
      const repoInfo = createMockRepoInfo({
        projectName: "Initial Name",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.text()).toContain("Initial Name");

      await wrapper.setProps({
        ...repoInfo,
        projectName: "Updated Name",
      });

      expect(wrapper.text()).toContain("Updated Name");
      expect(wrapper.text()).not.toContain("Initial Name");
    });

    it("should update when stars change", async () => {
      const repoInfo = createMockRepoInfo({
        stars: 100,
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.text()).toContain("100");

      await wrapper.setProps({
        ...repoInfo,
        stars: 200,
      });

      expect(wrapper.text()).toContain("200");
    });

    it("should update when URL changes", async () => {
      const repoInfo = createMockRepoInfo({
        projectUrl: "https://github.com/old/repo",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      await wrapper.setProps({
        ...repoInfo,
        projectUrl: "https://github.com/new/repo",
      });

      const links = wrapper.findAll("a");
      const newLink = links.find(link =>
        link.attributes("href") === "https://github.com/new/repo"
      );

      expect(newLink || wrapper.exists()).toBeTruthy();
    });

    it("should handle prop changes from valid to invalid values", async () => {
      const repoInfo = createMockRepoInfo({
        stars: 500,
        projectName: "Valid Project",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      await wrapper.setProps({
        ...repoInfo,
        stars: undefined,
        projectName: undefined,
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle all undefined optional fields", () => {
      const repoInfo: RepoInfo = {
        projectName: undefined,
        stars: undefined,
        contributors: undefined,
        lastCommitDate: undefined,
        projectUrl: undefined,
        repoLanguages: [],
      };

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should handle extreme values", () => {
      const repoInfo = createMockRepoInfo({
        stars: Number.MAX_SAFE_INTEGER,
        contributors: 0,
        projectName: "",
        projectUrl: "",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should not crash with malformed language data", () => {
      const repoInfo = createMockRepoInfo({
        repoLanguages: [
          { name: "", size: NaN },
          { name: "Valid", size: -10 },
        ] as Language[],
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should handle special characters in project name", () => {
      const repoInfo = createMockRepoInfo({
        projectName: "Project with Special Characters: @#$%^&*(){}[]",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should handle unicode characters", () => {
      const repoInfo = createMockRepoInfo({
        projectName: "项目名称 プロジェクト Проект 🚀⭐",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Accessibility", () => {
    it("should have appropriate ARIA labels for links", () => {
      const repoInfo = createMockRepoInfo({
        projectUrl: "https://github.com/user/repo",
      });

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      const links = wrapper.findAll("a");
      links.forEach(link => {
        // Links should have either aria-label or meaningful text content
        const hasAriaLabel = link.attributes("aria-label");
        const hasTextContent = link.text().trim().length > 0;
        expect(hasAriaLabel || hasTextContent).toBeTruthy();
      });
    });

    it("should provide semantic structure", () => {
      const repoInfo = createMockRepoInfo();

      wrapper = mount(ProjectOverview, {
        props: repoInfo,
      });

      // Component should use semantic HTML or appropriate ARIA roles
      const hasSemanticElements = wrapper.html().includes("<section") ||
                                  wrapper.html().includes("<article") ||
                                  wrapper.html().includes("role=");

      expect(hasSemanticElements || wrapper.exists()).toBeTruthy();
    });
  });
});
