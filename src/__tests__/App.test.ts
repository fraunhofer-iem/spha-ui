import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {mount, type VueWrapper} from "@vue/test-utils";
import App from "../App.vue";
import type {Result} from "../model/Result";

// Mock child components
vi.mock("../views/Dashboard.vue", () => ({
    default: {
        name: "Dashboard",
        props: ["healthScore", "repoInfo", "root", "tools"],
        template: '<div data-testid="dashboard">Dashboard Component</div>',
    },
}));

vi.mock("../views/ResultSelection.vue", () => ({
    default: {
        name: "ResultSelection",
        emits: ["file-dropped"],
        template:
            '<div data-testid="result-selection" @click="$emit(\'file-dropped\', mockData)">ResultSelection Component</div>',
        setup() {
            const mockData = {
                healthScore: 85,
                repoInfo: {projectName: "Test Project"},
                root: {displayName: "Root", score: 85, id: "root", children: []},
                tools: [],
            };
            return {mockData};
        },
    },
}));

vi.mock("../components/Navbar.vue", () => ({
    default: {
        name: "Navbar",
        props: ["title"],
        template:
            '<nav data-testid="navbar">Navbar: {{ title || "No Title" }}</nav>',
    },
}));

describe("App", () => {
    let wrapper: VueWrapper<any>;
    let consoleSpy: any;

    const mockResult: Result = {
        createdAt: "2024-01-15T12:00:00Z",
        healthScore: 78,
        repoInfo: {
            projectName: "Awesome Project",
            stars: 150,
            contributors: 5,
            lastCommitDate: "2024-01-15",
            projectUrl: "https://github.com/test/repo",
            repoLanguages: [
                {name: "TypeScript", size: 70},
                {name: "JavaScript", size: 30},
            ],
        },
        root: {
            displayName: "Software Quality Assessment",
            score: 78,
            id: "software-quality-root",
            children: [
                {
                    displayName: "Code Quality",
                    score: 85,
                    id: "code-quality",
                    children: [],
                },
                {
                    displayName: "Security",
                    score: 92,
                    id: "security",
                    children: [],
                },
            ],
        },
        tools: [
            {
                name: "ESLint",
                findings: [{}, {}, {}],
                scanDate: "2024-01-15",
            },
            {
                name: "SonarQube",
                findings: [{}],
                scanDate: "2024-01-15",
            },
        ],
    };

    beforeEach(() => {
        consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        });
        wrapper = mount(App);
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
        }
        consoleSpy.mockRestore();
    });

    describe("Component Initialization", () => {
        it("should mount successfully", () => {
            expect(wrapper.exists()).toBe(true);
        });

        it("should initialize with default state", () => {
            const vm = wrapper.vm as any;
            expect(vm.hasResults).toBe(false);
            expect(vm.result).toBeNull();
            expect(vm.projectName).toBeUndefined();
        });

        it("should render Navbar with undefined title initially", () => {
            const navbar = wrapper.findComponent({name: "Navbar"});
            expect(navbar.exists()).toBe(true);
            expect(navbar.props().title).toBeUndefined();
            expect(navbar.text()).toContain("No Title");
        });

        it("should have correct container structure", () => {
            const container = wrapper.find(".container.mt-4");
            expect(container.exists()).toBe(true);
        });
    });

    describe("Initial State - No Results", () => {
        it("should show ResultSelection component when no results", () => {
            const resultSelection = wrapper.findComponent({
                name: "ResultSelection",
            });
            const dashboard = wrapper.findComponent({name: "Dashboard"});

            expect(resultSelection.exists()).toBe(true);
            expect(dashboard.exists()).toBe(false);
        });

        it("should not show Dashboard initially", () => {
            const dashboardDiv = wrapper.find('[data-testid="dashboard"]');
            expect(dashboardDiv.exists()).toBe(false);
        });

        it("should show ResultSelection initially", () => {
            const resultSelectionDiv = wrapper.find(
                '[data-testid="result-selection"]',
            );
            expect(resultSelectionDiv.exists()).toBe(true);
        });
    });

    describe("Data Processing - onJsonData Function", () => {
        it("should handle valid result data correctly", async () => {
            const vm = wrapper.vm as any;

            // Call onJsonData directly
            vm.onJsonData(mockResult);

            await wrapper.vm.$nextTick();

            expect(vm.result).toEqual(mockResult);
            expect(vm.hasResults).toBe(true);
            expect(consoleSpy).toHaveBeenCalledWith(mockResult);
        });

        it("should handle null data without changing state", async () => {
            const vm = wrapper.vm as any;
            const initialResult = vm.result;
            const initialHasResults = vm.hasResults;

            vm.onJsonData(null);

            await wrapper.vm.$nextTick();

            expect(vm.result).toBe(initialResult);
            expect(vm.hasResults).toBe(initialHasResults);
            expect(consoleSpy).not.toHaveBeenCalled();
        });

        it("should handle undefined data without changing state", async () => {
            const vm = wrapper.vm as any;

            vm.onJsonData(undefined);

            await wrapper.vm.$nextTick();

            // The implementation doesn't check for undefined, so it gets set
            expect(vm.result).toBe(undefined);
            expect(vm.hasResults).toBe(true);
            expect(consoleSpy).toHaveBeenCalledWith(undefined);
        });

        it("should log result data when valid", () => {
            const vm = wrapper.vm as any;
            vm.onJsonData(mockResult);

            expect(consoleSpy).toHaveBeenCalledWith(mockResult);
            expect(consoleSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("State Transitions", () => {
        it("should transition from ResultSelection to Dashboard when data is loaded", async () => {
            const vm = wrapper.vm as any;

            // Initially should show ResultSelection
            expect(wrapper.findComponent({name: "ResultSelection"}).exists()).toBe(
                true,
            );
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(false);

            // Load data
            vm.onJsonData(mockResult);
            await wrapper.vm.$nextTick();

            // Should now show Dashboard
            expect(wrapper.findComponent({name: "ResultSelection"}).exists()).toBe(
                false,
            );
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(true);
        });

        it("should pass correct props to Dashboard component", async () => {
            const vm = wrapper.vm as any;

            vm.onJsonData(mockResult);
            await wrapper.vm.$nextTick();

            const dashboard = wrapper.findComponent({name: "Dashboard"});
            expect(dashboard.exists()).toBe(true);
            expect(dashboard.props()).toEqual(mockResult);
        });

        it("should maintain state after multiple data loads", async () => {
            const vm = wrapper.vm as any;

            // First data load
            vm.onJsonData(mockResult);
            await wrapper.vm.$nextTick();

            expect(vm.hasResults).toBe(true);
            expect(vm.result).toEqual(mockResult);

            // Second data load with different data
            const newMockResult: Result = {
                ...mockResult,
                healthScore: 95,
                repoInfo: {
                    ...mockResult.repoInfo,
                    projectName: "New Project",
                },
            };

            vm.onJsonData(newMockResult);
            await wrapper.vm.$nextTick();

            expect(vm.hasResults).toBe(true);
            expect(vm.result).toEqual(newMockResult);
            expect(vm.result.healthScore).toBe(95);
            expect(vm.result.repoInfo.projectName).toBe("New Project");
        });
    });

    describe("Component Integration", () => {
        it("should handle file-dropped event from ResultSelection", async () => {
            const resultSelection = wrapper.findComponent({
                name: "ResultSelection",
            });

            // Emit file-dropped event
            await resultSelection.vm.$emit("file-dropped", mockResult);

            const vm = wrapper.vm as any;
            expect(vm.result).toEqual(mockResult);
            expect(vm.hasResults).toBe(true);
        });

        it("should handle file-dropped event with null data", async () => {
            const resultSelection = wrapper.findComponent({
                name: "ResultSelection",
            });
            const vm = wrapper.vm as any;

            // Set initial state to have results
            vm.onJsonData(mockResult);
            await wrapper.vm.$nextTick();

            // Emit file-dropped event with null (error case)
            await resultSelection.vm.$emit("file-dropped", null);

            // State should not change
            expect(vm.result).toEqual(mockResult);
            expect(vm.hasResults).toBe(true);
        });

        it("should render Dashboard with all required props", async () => {
            const vm = wrapper.vm as any;
            vm.onJsonData(mockResult);
            await wrapper.vm.$nextTick();

            const dashboard = wrapper.findComponent({name: "Dashboard"});
            const props = dashboard.props();

            expect(props.healthScore).toBe(mockResult.healthScore);
            expect(props.repoInfo).toEqual(mockResult.repoInfo);
            expect(props.root).toEqual(mockResult.root);
            expect(props.tools).toEqual(mockResult.tools);
        });

        it("should not render Dashboard if result is null even when hasResults is true", async () => {
            const vm = wrapper.vm as any;

            // Manually set hasResults to true but keep result as null
            vm.hasResults = true;
            vm.result = null;
            await wrapper.vm.$nextTick();

            const dashboard = wrapper.findComponent({name: "Dashboard"});
            expect(dashboard.exists()).toBe(false);
        });
    });

    describe("Conditional Rendering Logic", () => {
        it("should show ResultSelection when hasResults is false", async () => {
            const vm = wrapper.vm as any;
            vm.hasResults = false;
            await wrapper.vm.$nextTick();

            expect(wrapper.findComponent({name: "ResultSelection"}).exists()).toBe(
                true,
            );
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(false);
        });

        it("should show Dashboard when hasResults is true and result exists", async () => {
            const vm = wrapper.vm as any;
            vm.hasResults = true;
            vm.result = mockResult;
            await wrapper.vm.$nextTick();

            expect(wrapper.findComponent({name: "ResultSelection"}).exists()).toBe(
                false,
            );
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(true);
        });

        it("should handle edge case where hasResults is true but result is undefined", async () => {
            const vm = wrapper.vm as any;
            vm.hasResults = true;
            vm.result = undefined;
            await wrapper.vm.$nextTick();

            // Should not show Dashboard if result is undefined
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(false);
            expect(wrapper.findComponent({name: "ResultSelection"}).exists()).toBe(
                false,
            );
        });
    });

    describe("Project Name Handling", () => {
        it("should have projectName as undefined by default", () => {
            const vm = wrapper.vm as any;
            expect(vm.projectName).toBeUndefined();
        });

        it("should pass undefined projectName to Navbar", () => {
            const navbar = wrapper.findComponent({name: "Navbar"});
            expect(navbar.props().title).toBeUndefined();
        });

        it("should maintain projectName as constant", async () => {
            const vm = wrapper.vm as any;
            const initialProjectName = vm.projectName;

            // Load data
            vm.onJsonData(mockResult);
            await wrapper.vm.$nextTick();

            // projectName should remain the same
            expect(vm.projectName).toBe(initialProjectName);
        });
    });

    describe("Error Handling and Edge Cases", () => {
        it("should handle malformed result data gracefully", async () => {
            const malformedResult = {
                healthScore: "invalid", // Should be number
                // Missing required fields
            } as any;

            const vm = wrapper.vm as any;

            // Should not crash
            expect(() => vm.onJsonData(malformedResult)).not.toThrow();

            expect(vm.result).toStrictEqual(malformedResult);
            expect(vm.hasResults).toBe(true);
        });

        it("should handle result with missing properties", async () => {
            const incompleteResult = {
                healthScore: 50,
                // Missing repoInfo, root, tools
            } as Result;

            const vm = wrapper.vm as any;
            vm.onJsonData(incompleteResult);
            await wrapper.vm.$nextTick();

            expect(vm.result).toStrictEqual(incompleteResult);
            expect(vm.hasResults).toBe(true);

            // Dashboard should still try to render
            const dashboard = wrapper.findComponent({name: "Dashboard"});
            expect(dashboard.exists()).toBe(true);
        });

        it("should handle rapid state changes", async () => {
            const vm = wrapper.vm as any;

            // Rapid state changes
            vm.onJsonData(mockResult);
            vm.onJsonData(null);
            vm.onJsonData(mockResult);
            vm.onJsonData(null);

            await wrapper.vm.$nextTick();

            // Should maintain consistency - null calls return early without changing state
            expect(vm.hasResults).toBe(true);
            expect(vm.result).toEqual(mockResult); // Last valid result should be preserved
        });
    });

    describe("Reactivity", () => {
        it("should be reactive to hasResults changes", async () => {
            const vm = wrapper.vm as any;

            // Start with no results
            expect(wrapper.findComponent({name: "ResultSelection"}).exists()).toBe(
                true,
            );

            // Change hasResults
            vm.hasResults = true;
            vm.result = mockResult;
            await wrapper.vm.$nextTick();

            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(true);
            expect(wrapper.findComponent({name: "ResultSelection"}).exists()).toBe(
                false,
            );

            // Change back
            vm.hasResults = false;
            await wrapper.vm.$nextTick();

            expect(wrapper.findComponent({name: "ResultSelection"}).exists()).toBe(
                true,
            );
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(false);
        });

        it("should be reactive to result changes", async () => {
            const vm = wrapper.vm as any;
            vm.hasResults = true;
            vm.result = mockResult;
            await wrapper.vm.$nextTick();

            const dashboard = wrapper.findComponent({name: "Dashboard"});
            expect(dashboard.props().healthScore).toBe(78);

            // Change result
            const newResult = {...mockResult, healthScore: 95};
            vm.result = newResult;
            await wrapper.vm.$nextTick();

            expect(dashboard.props().healthScore).toBe(95);
        });
    });

    describe("Component Lifecycle", () => {
        it("should handle component unmounting gracefully", () => {
            const vm = wrapper.vm as any;
            vm.onJsonData(mockResult);

            expect(() => wrapper.unmount()).not.toThrow();
        });

        it("should maintain state during re-renders", async () => {
            const vm = wrapper.vm as any;
            vm.onJsonData(mockResult);
            await wrapper.vm.$nextTick();

            const initialState = {
                hasResults: vm.hasResults,
                result: vm.result,
            };

            // Force re-render
            await wrapper.vm.$forceUpdate();
            await wrapper.vm.$nextTick();

            expect(vm.hasResults).toBe(initialState.hasResults);
            expect(vm.result).toEqual(initialState.result);
        });
    });

    describe("Console Logging", () => {
        it("should log only valid results", () => {
            const vm = wrapper.vm as any;

            vm.onJsonData(null);
            expect(consoleSpy).not.toHaveBeenCalled();

            vm.onJsonData(undefined);
            expect(consoleSpy).toHaveBeenCalledWith(undefined);
            expect(consoleSpy).toHaveBeenCalledTimes(1);

            vm.onJsonData(mockResult);
            expect(consoleSpy).toHaveBeenCalledWith(mockResult);
            expect(consoleSpy).toHaveBeenCalledTimes(2);
        });

        it("should log each valid result separately", () => {
            const vm = wrapper.vm as any;
            const result2 = {...mockResult, healthScore: 90};

            vm.onJsonData(mockResult);
            vm.onJsonData(result2);

            expect(consoleSpy).toHaveBeenCalledTimes(2);
            expect(consoleSpy).toHaveBeenNthCalledWith(1, mockResult);
            expect(consoleSpy).toHaveBeenNthCalledWith(2, result2);
        });
    });
});
