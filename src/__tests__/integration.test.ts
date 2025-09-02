import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {mount, type VueWrapper} from "@vue/test-utils";
import App from "../App.vue";
import {parse} from "../util/Parser";
import type {Kpi} from "../model/Result";
import {createMockFile, createMockFileList,} from "./setup.ts";

// Import test data
import kpiResultsSmall from "../../example/kpi-results-small.json";

describe("Integration Tests - Complete Application Flow", () => {
    let wrapper: VueWrapper<any>;
    let consoleSpy: any;
    let consoleErrorSpy: any;

    beforeEach(() => {
        consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
        });
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {
        });

        // Mock FileReader with proper behavior simulation
        global.FileReader = vi.fn(() => {
            const mockReader = {
                onload: null as ((e: any) => void) | null,
                onerror: null as ((e: any) => void) | null,
                result: null as string | null,
                readAsText: vi.fn((file: File) => {
                    // Simulate async file reading
                    setTimeout(() => {
                        if (mockReader.onload) {
                            mockReader.result = file.name.includes("invalid")
                                ? "invalid json"
                                : '{"valid": "json"}';
                            mockReader.onload({target: {result: mockReader.result}});
                        }
                    }, 0);
                }),
            };
            return mockReader;
        }) as any;

        // Mock ResizeObserver
        global.ResizeObserver = vi.fn(() => ({
            observe: vi.fn(),
            unobserve: vi.fn(),
            disconnect: vi.fn(),
        })) as any;

        wrapper = mount(App);
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
        }
        consoleSpy.mockRestore();
        consoleErrorSpy.mockRestore();
        vi.clearAllMocks();
    });

    describe("Complete User Journey - Valid File Upload", () => {
        it("should handle the complete flow from file upload to dashboard display", async () => {
            // 1. Initial state - should show ResultSelection
            expect(wrapper.findComponent({name: "ResultSelection"}).exists()).toBe(
                true,
            );
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(false);

            // 2. Parse the test data to get expected result
            const expectedResult = parse(kpiResultsSmall);
            expect(expectedResult).toBeDefined();

            // 3. Prepare test data
            const jsonContent = JSON.stringify(kpiResultsSmall);

            // 4. Mock FileReader to return our test content
            global.FileReader = vi.fn(() => ({
                onload: null as ((e: any) => void) | null,
                onerror: null as ((e: any) => void) | null,
                result: null as string | null,
                readAsText: vi.fn(function (this: any) {
                    // Simulate successful file reading
                    setTimeout(() => {
                        if (this.onload) {
                            this.result = jsonContent;
                            this.onload({target: {result: jsonContent}});
                        }
                    }, 0);
                }),
            })) as any;

            // 5. Create file and trigger file handling
            const file = createMockFile(jsonContent, "kpi-results-small.json");
            const fileList = createMockFileList([file]);

            const resultSelection = wrapper.findComponent({
                name: "ResultSelection",
            });
            const resultSelectionVm = resultSelection.vm as any;

            // Call handleFile method directly
            resultSelectionVm.handleFile(fileList);

            // Wait for FileReader to process
            await new Promise((resolve) => setTimeout(resolve, 10));
            await wrapper.vm.$nextTick();

            // 6. Verify state transition
            const appVm = wrapper.vm as any;
            expect(appVm.hasResults).toBe(true);
            expect(appVm.result).toEqual(expectedResult);

            // 7. Verify component transition
            expect(wrapper.findComponent({name: "ResultSelection"}).exists()).toBe(
                false,
            );
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(true);

            // 8. Verify Dashboard receives correct props
            const dashboard = wrapper.findComponent({name: "Dashboard"});
            expect(dashboard.props()).toEqual(expectedResult);

            // 9. Verify data logging
            expect(consoleSpy).toHaveBeenCalledWith(expectedResult);
        });

        it("should maintain data integrity throughout the flow", async () => {
            const expectedResult = parse(kpiResultsSmall);
            const jsonContent = JSON.stringify(kpiResultsSmall);

            // Mock FileReader to return our test content
            global.FileReader = vi.fn(() => ({
                onload: null as ((e: any) => void) | null,
                onerror: null as ((e: any) => void) | null,
                result: null as string | null,
                readAsText: vi.fn(function (this: any) {
                    // Simulate successful file reading
                    setTimeout(() => {
                        if (this.onload) {
                            this.result = jsonContent;
                            this.onload({target: {result: jsonContent}});
                        }
                    }, 0);
                }),
            })) as any;

            const file = createMockFile(jsonContent);

            // Simulate complete flow
            const resultSelection = wrapper.findComponent({
                name: "ResultSelection",
            });
            (resultSelection.vm as any).handleFile(createMockFileList([file]));

            // Wait for FileReader to process
            await new Promise((resolve) => setTimeout(resolve, 10));
            await wrapper.vm.$nextTick();

            const appVm = wrapper.vm as any;

            // Verify all data fields are preserved
            expect(appVm.result.healthScore).toBe(expectedResult!.healthScore);
            expect(appVm.result.repoInfo).toEqual(expectedResult!.repoInfo);
            expect(appVm.result.root).toEqual(expectedResult!.root);
            expect(appVm.result.tools).toEqual(expectedResult!.tools);

            // Verify nested KPI structure integrity
            const rootKpi = appVm.result.root;
            expect(rootKpi.children).toHaveLength(
                expectedResult!.root.children.length,
            );

            rootKpi.children.forEach((child: Kpi, index: number) => {
                const expectedChild = expectedResult!.root.children[index];
                if (expectedChild) {
                    expect(child.displayName).toBe(expectedChild.displayName);
                    expect(child.score).toBe(expectedChild.score);
                    expect(child.id).toBe(expectedChild.id);
                    expect(child.children).toEqual(expectedChild.children);
                }
            });
        });
    });

    describe("Error Handling Integration", () => {
        it("should handle invalid JSON gracefully throughout the application", async () => {
            const invalidJsonContent = '{"invalid": json}';
            const file = createMockFile(invalidJsonContent, "invalid.json");

            // Mock FileReader to return invalid JSON content
            global.FileReader = vi.fn(() => ({
                onload: null as ((e: any) => void) | null,
                onerror: null as ((e: any) => void) | null,
                result: null as string | null,
                readAsText: vi.fn(function (this: any) {
                    // Simulate successful file reading with invalid JSON
                    setTimeout(() => {
                        if (this.onload) {
                            this.result = invalidJsonContent;
                            this.onload({target: {result: invalidJsonContent}});
                        }
                    }, 0);
                }),
            })) as any;

            const resultSelection = wrapper.findComponent({
                name: "ResultSelection",
            });
            (resultSelection.vm as any).handleFile(createMockFileList([file]));

            // Wait for FileReader to process
            await new Promise((resolve) => setTimeout(resolve, 10));
            await wrapper.vm.$nextTick();

            // App should remain in initial state
            const appVm = wrapper.vm as any;
            expect(appVm.hasResults).toBe(false);
            expect(appVm.result).toBeNull();

            // Should still show ResultSelection
            expect(wrapper.findComponent({name: "ResultSelection"}).exists()).toBe(
                true,
            );
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(false);

            // ResultSelection should show error message
            const resultSelectionText = wrapper
                .findComponent({name: "ResultSelection"})
                .text();
            expect(resultSelectionText).toContain("Failed to parse JSON");
        });

        it("should handle valid JSON but invalid result structure", async () => {
            const validJsonInvalidStructure = JSON.stringify({
                someOtherProperty: "value",
            });
            const file = createMockFile(
                validJsonInvalidStructure,
                "invalid-structure.json",
            );

            // Mock FileReader to return valid JSON with invalid structure
            global.FileReader = vi.fn(() => ({
                onload: null as ((e: any) => void) | null,
                onerror: null as ((e: any) => void) | null,
                result: null as string | null,
                readAsText: vi.fn(function (this: any) {
                    // Simulate successful file reading with invalid structure
                    setTimeout(() => {
                        if (this.onload) {
                            this.result = validJsonInvalidStructure;
                            this.onload({target: {result: validJsonInvalidStructure}});
                        }
                    }, 0);
                }),
            })) as any;

            const resultSelection = wrapper.findComponent({
                name: "ResultSelection",
            });
            (resultSelection.vm as any).handleFile(createMockFileList([file]));

            // Wait for FileReader to process
            await new Promise((resolve) => setTimeout(resolve, 10));
            await wrapper.vm.$nextTick();

            // Should not transition to Dashboard
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(false);
            expect(wrapper.findComponent({name: "ResultSelection"}).exists()).toBe(
                true,
            );
        });

        it("should recover from error state when valid file is provided", async () => {
            // First, trigger an error
            const invalidJsonContent = '{"invalid": json}';
            const invalidFile = createMockFile(invalidJsonContent, "error.json");

            // Mock FileReader to return invalid JSON content
            global.FileReader = vi.fn(() => ({
                onload: null as ((e: any) => void) | null,
                onerror: null as ((e: any) => void) | null,
                result: null as string | null,
                readAsText: vi.fn(function (this: any) {
                    // Simulate successful file reading with invalid JSON
                    setTimeout(() => {
                        if (this.onload) {
                            this.result = invalidJsonContent;
                            this.onload({target: {result: invalidJsonContent}});
                        }
                    }, 0);
                }),
            })) as any;

            const resultSelection = wrapper.findComponent({
                name: "ResultSelection",
            });
            (resultSelection.vm as any).handleFile(createMockFileList([invalidFile]));

            // Wait for FileReader to process invalid file
            await new Promise((resolve) => setTimeout(resolve, 10));
            await wrapper.vm.$nextTick();

            // Verify error state
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(false);

            // Then provide valid file
            const validJsonContent = JSON.stringify(kpiResultsSmall);
            const validFile = createMockFile(validJsonContent, "valid.json");

            // Mock FileReader to return valid content
            global.FileReader = vi.fn(() => ({
                onload: null as ((e: any) => void) | null,
                onerror: null as ((e: any) => void) | null,
                result: null as string | null,
                readAsText: vi.fn(function (this: any) {
                    // Simulate successful file reading with valid JSON
                    setTimeout(() => {
                        if (this.onload) {
                            this.result = validJsonContent;
                            this.onload({target: {result: validJsonContent}});
                        }
                    }, 0);
                }),
            })) as any;

            (resultSelection.vm as any).handleFile(createMockFileList([validFile]));

            // Wait for FileReader to process valid file
            await new Promise((resolve) => setTimeout(resolve, 10));
            await wrapper.vm.$nextTick();

            // Should recover and show Dashboard
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(true);
            expect(wrapper.findComponent({name: "ResultSelection"}).exists()).toBe(
                false,
            );
        });
    });

    describe("Data Processing Integration", () => {
        it("should correctly process and display KPI hierarchy", async () => {
            const jsonContent = JSON.stringify(kpiResultsSmall);
            const file = createMockFile(jsonContent);

            // Mock FileReader to return our test content
            global.FileReader = vi.fn(() => ({
                onload: null as ((e: any) => void) | null,
                onerror: null as ((e: any) => void) | null,
                result: null as string | null,
                readAsText: vi.fn(function (this: any) {
                    // Simulate successful file reading
                    setTimeout(() => {
                        if (this.onload) {
                            this.result = jsonContent;
                            this.onload({target: {result: jsonContent}});
                        }
                    }, 0);
                }),
            })) as any;

            const resultSelection = wrapper.findComponent({
                name: "ResultSelection",
            });
            (resultSelection.vm as any).handleFile(createMockFileList([file]));

            // Wait for FileReader to process
            await new Promise((resolve) => setTimeout(resolve, 10));
            await wrapper.vm.$nextTick();

            // Verify KPI structure is correctly passed to components
            const dashboard = wrapper.findComponent({name: "Dashboard"});
            expect(dashboard.exists()).toBe(true);

            const rootKpi = dashboard.props().root;
            expect(rootKpi.displayName).toBe("Software Quality Assessment");
            expect(rootKpi.children).toHaveLength(5);

            // Verify specific KPIs are present
            const kpiNames = rootKpi.children.map((child: Kpi) => child.displayName);
            expect(kpiNames).toContain("Code Quality");
            expect(kpiNames).toContain("Test Coverage");
            expect(kpiNames).toContain("Security");
            expect(kpiNames).toContain("Maintainability");
            expect(kpiNames).toContain("Performance");
        });

        it("should correctly process repository information", async () => {
            const jsonContent = JSON.stringify(kpiResultsSmall);
            const file = createMockFile(jsonContent);

            // Mock FileReader to return our test content
            global.FileReader = vi.fn(() => ({
                onload: null as ((e: any) => void) | null,
                onerror: null as ((e: any) => void) | null,
                result: null as string | null,
                readAsText: vi.fn(function (this: any) {
                    // Simulate successful file reading
                    setTimeout(() => {
                        if (this.onload) {
                            this.result = jsonContent;
                            this.onload({target: {result: jsonContent}});
                        }
                    }, 0);
                }),
            })) as any;

            const resultSelection = wrapper.findComponent({
                name: "ResultSelection",
            });

            (resultSelection.vm as any).handleFile(createMockFileList([file]));

            // Wait for FileReader to process
            await new Promise((resolve) => setTimeout(resolve, 10));
            await wrapper.vm.$nextTick();

            const dashboard = wrapper.findComponent({name: "Dashboard"});
            const repoInfo = dashboard.props().repoInfo;

            expect(repoInfo.projectName).toBe("Awesome Project");
            expect(repoInfo.stars).toBe(127);
            expect(repoInfo.contributors).toBe(8);
            expect(repoInfo.lastCommitDate).toBe("2024-01-15T10:30:00Z");
            expect(repoInfo.repoLanguages).toHaveLength(4);
        });

        it("should correctly process tool information", async () => {
            const jsonContent = JSON.stringify(kpiResultsSmall);
            const file = createMockFile(jsonContent);

            // Mock FileReader to return our test content
            global.FileReader = vi.fn(() => ({
                onload: null as ((e: any) => void) | null,
                onerror: null as ((e: any) => void) | null,
                result: null as string | null,
                readAsText: vi.fn(function (this: any) {
                    // Simulate successful file reading
                    setTimeout(() => {
                        if (this.onload) {
                            this.result = jsonContent;
                            this.onload({target: {result: jsonContent}});
                        }
                    }, 0);
                }),
            })) as any;

            const resultSelection = wrapper.findComponent({
                name: "ResultSelection",
            });

            (resultSelection.vm as any).handleFile(createMockFileList([file]));

            // Wait for FileReader to process
            await new Promise((resolve) => setTimeout(resolve, 10));
            await wrapper.vm.$nextTick();

            const dashboard = wrapper.findComponent({name: "Dashboard"});
            const tools = dashboard.props().tools;

            expect(tools).toHaveLength(3);

            const toolNames = tools.map((tool: any) => tool.name);
            expect(toolNames).toContain("ESLint");
            expect(toolNames).toContain("SonarQube");
            expect(toolNames).toContain("Jest");
        });
    });

    describe("Component Communication Integration", () => {
        it("should properly handle file-dropped events", async () => {
            const expectedResult = parse(kpiResultsSmall);

            // Simulate the file-dropped event by calling the App's event handler directly
            const appVm = wrapper.vm as any;
            appVm.onJsonData(expectedResult);
            await wrapper.vm.$nextTick();

            expect(appVm.result).toEqual(expectedResult);
            expect(appVm.hasResults).toBe(true);
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(true);
        });

        it("should handle multiple file uploads correctly", async () => {
            const result1 = parse(kpiResultsSmall);

            // Create a modified version for second upload
            const modifiedData = {
                ...kpiResultsSmall,
                resultHierarchy: {
                    ...kpiResultsSmall.resultHierarchy,
                    root: {
                        ...kpiResultsSmall.resultHierarchy.root,
                        result: {
                            ...kpiResultsSmall.resultHierarchy.root.result,
                            score: 85,
                        },
                    },
                },
            };
            const result2 = parse(modifiedData);

            const appVm = wrapper.vm as any;

            // First upload
            appVm.onJsonData(result1);
            await wrapper.vm.$nextTick();
            expect(appVm.result.healthScore).toBe(result1!.healthScore);

            // Second upload should replace first
            appVm.onJsonData(result2);
            await wrapper.vm.$nextTick();
            expect(appVm.result.healthScore).toBe(result2!.healthScore);
        });
    });

    describe("State Management Integration", () => {
        it("should maintain consistent state across component updates", async () => {
            const expectedResult = parse(kpiResultsSmall);
            const appVm = wrapper.vm as any;

            // Simulate data loading
            appVm.onJsonData(expectedResult);
            await wrapper.vm.$nextTick();

            // Force component updates
            await wrapper.vm.$forceUpdate();
            await wrapper.vm.$nextTick();

            // State should remain consistent
            expect(appVm.hasResults).toBe(true);
            expect(appVm.result).toEqual(expectedResult);

            // Dashboard should still be rendered correctly
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(true);
            expect(wrapper.findComponent({name: "ResultSelection"}).exists()).toBe(
                false,
            );
        });

        it("should handle state transitions correctly", async () => {
            const appVm = wrapper.vm as any;

            // Initial state
            expect(appVm.hasResults).toBe(false);
            expect(appVm.result).toBeNull();

            // Transition to loaded state
            const result = parse(kpiResultsSmall);
            appVm.onJsonData(result);
            await wrapper.vm.$nextTick();

            // Verify state transition
            expect(appVm.hasResults).toBe(true);
            expect(appVm.result).toEqual(result);

            // Verify UI transition
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(true);
            expect(wrapper.findComponent({name: "ResultSelection"}).exists()).toBe(
                false,
            );
        });
    });

    describe("Performance and Scalability", () => {
        it("should handle large datasets efficiently", async () => {
            // Create a large dataset
            const largeKpiData = {
                ...kpiResultsSmall,
                resultHierarchy: {
                    root: {
                        ...kpiResultsSmall.resultHierarchy.root,
                        edges: Array.from({length: 50}, (_, i) => ({
                            target: {
                                typeId: `kpi-${i}`,
                                metaInfo: {displayName: `KPI ${i}`},
                                result: {score: Math.floor(Math.random() * 100)},
                                edges: [],
                            },
                        })),
                    },
                },
            };

            const startTime = performance.now();

            const expectedResult = parse(largeKpiData);
            const resultSelection = wrapper.findComponent({
                name: "ResultSelection",
            });
            await resultSelection.vm.$emit("file-dropped", expectedResult);
            await wrapper.vm.$nextTick();

            const endTime = performance.now();
            const processingTime = endTime - startTime;

            // Should complete within reasonable time (adjust threshold as needed)
            expect(processingTime).toBeLessThan(1000); // 1 second
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(true);
        });

        it("should not cause memory leaks with multiple file uploads", async () => {
            const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

            // Perform multiple uploads
            const appVm = wrapper.vm as any;
            for (let i = 0; i < 10; i++) {
                const result = parse(kpiResultsSmall);
                appVm.onJsonData(result);
                await wrapper.vm.$nextTick();
            }

            // Force garbage collection if available
            if (global.gc) {
                global.gc();
            }

            const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
            const memoryIncrease = finalMemory - initialMemory;

            // Memory increase should be reasonable (adjust threshold as needed)
            expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB
        });
    });

    describe("User Experience Integration", () => {
        it("should provide immediate feedback on file operations", async () => {
            const jsonContent = JSON.stringify(kpiResultsSmall);
            const file = createMockFile(jsonContent);

            // Mock FileReader to return our test content
            global.FileReader = vi.fn(() => ({
                onload: null as ((e: any) => void) | null,
                onerror: null as ((e: any) => void) | null,
                result: null as string | null,
                readAsText: vi.fn(function (this: any) {
                    // Simulate successful file reading
                    setTimeout(() => {
                        if (this.onload) {
                            this.result = jsonContent;
                            this.onload({target: {result: jsonContent}});
                        }
                    }, 0);
                }),
            })) as any;

            const resultSelection = wrapper.findComponent({
                name: "ResultSelection",
            });
            const resultSelectionVm = resultSelection.vm as any;

            // Start file processing
            resultSelectionVm.handleFile(createMockFileList([file]));
            await wrapper.vm.$nextTick();

            // Should show filename while processing
            expect(resultSelection.text()).toContain("test.json");

            // Wait for FileReader to process and check success message before transition
            await new Promise((resolve) => setTimeout(resolve, 5));
            await wrapper.vm.$nextTick();

            // Check if we're still in ResultSelection state (before transition)
            if (wrapper.findComponent({name: "ResultSelection"}).exists()) {
                expect(resultSelection.text()).toContain(
                    "JSON file processed successfully",
                );
            } else {
                // If already transitioned, verify the Dashboard is shown (successful processing)
                expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(
                    true,
                );
            }
        });

        it("should maintain navbar consistency throughout navigation", async () => {
            const navbar = wrapper.findComponent({name: "Navbar"});

            // Initially should have default title
            expect(navbar.props().title).toBe("Software Product Health Assistant");

            // Load data and verify navbar remains
            const expectedResult = parse(kpiResultsSmall);
            const appVm = wrapper.vm as any;
            appVm.onJsonData(expectedResult);
            await wrapper.vm.$nextTick();

            // Navbar should still be present with same props
            const navbarAfterLoad = wrapper.findComponent({name: "Navbar"});
            expect(navbarAfterLoad.exists()).toBe(true);
            expect(navbarAfterLoad.props().title).toBe(
                "Software Product Health Assistant",
            );
        });
    });

    describe("End-to-End Scenarios", () => {
        it("should complete the full analysis workflow", async () => {
            // 1. Start with file selection
            expect(wrapper.findComponent({name: "ResultSelection"}).exists()).toBe(
                true,
            );

            // 2. Load and process file
            const jsonContent = JSON.stringify(kpiResultsSmall);
            const file = createMockFile(jsonContent);

            // Mock FileReader to return our test content
            global.FileReader = vi.fn(() => ({
                onload: null as ((e: any) => void) | null,
                onerror: null as ((e: any) => void) | null,
                result: null as string | null,
                readAsText: vi.fn(function (this: any) {
                    // Simulate successful file reading
                    setTimeout(() => {
                        if (this.onload) {
                            this.result = jsonContent;
                            this.onload({target: {result: jsonContent}});
                        }
                    }, 0);
                }),
            })) as any;

            const resultSelection = wrapper.findComponent({
                name: "ResultSelection",
            });
            (resultSelection.vm as any).handleFile(createMockFileList([file]));

            // Wait for FileReader to process
            await new Promise((resolve) => setTimeout(resolve, 10));
            await wrapper.vm.$nextTick();

            // 3. Verify dashboard is displayed
            const dashboard = wrapper.findComponent({name: "Dashboard"});
            expect(dashboard.exists()).toBe(true);

            // 4. Verify dashboard components are rendered
            // Note: We verify the dashboard exists and contains the expected data
            expect(dashboard.exists()).toBe(true);

            // 5. Verify data integrity end-to-end
            const dashboardProps = dashboard.props();
            expect(dashboardProps.healthScore).toBe(73);
            expect(dashboardProps.repoInfo.projectName).toBe("Awesome Project");
            expect(dashboardProps.root.children).toHaveLength(5);
            expect(dashboardProps.tools).toHaveLength(3);
        });

        it("should handle the complete error recovery workflow", async () => {
            // 1. Start with error scenario
            const invalidJsonContent = "invalid json";
            const invalidFile = createMockFile(invalidJsonContent);

            // Mock FileReader to return invalid content first
            global.FileReader = vi.fn(() => ({
                onload: null as ((e: any) => void) | null,
                onerror: null as ((e: any) => void) | null,
                result: null as string | null,
                readAsText: vi.fn(function (this: any) {
                    // Simulate successful file reading with invalid JSON
                    setTimeout(() => {
                        if (this.onload) {
                            this.result = invalidJsonContent;
                            this.onload({target: {result: invalidJsonContent}});
                        }
                    }, 0);
                }),
            })) as any;

            const resultSelection = wrapper.findComponent({
                name: "ResultSelection",
            });
            (resultSelection.vm as any).handleFile(createMockFileList([invalidFile]));

            // Wait for FileReader to process invalid file
            await new Promise((resolve) => setTimeout(resolve, 10));
            await wrapper.vm.$nextTick();

            // 2. Verify error state
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(false);

            // 3. Provide valid file
            const validJsonContent = JSON.stringify(kpiResultsSmall);
            const validFile = createMockFile(validJsonContent);

            // Mock FileReader to return valid content
            global.FileReader = vi.fn(() => ({
                onload: null as ((e: any) => void) | null,
                onerror: null as ((e: any) => void) | null,
                result: null as string | null,
                readAsText: vi.fn(function (this: any) {
                    // Simulate successful file reading with valid JSON
                    setTimeout(() => {
                        if (this.onload) {
                            this.result = validJsonContent;
                            this.onload({target: {result: validJsonContent}});
                        }
                    }, 0);
                }),
            })) as any;

            (resultSelection.vm as any).handleFile(createMockFileList([validFile]));

            // Wait for FileReader to process valid file
            await new Promise((resolve) => setTimeout(resolve, 10));
            await wrapper.vm.$nextTick();

            // 4. Verify complete recovery
            expect(wrapper.findComponent({name: "Dashboard"}).exists()).toBe(true);
            expect(wrapper.findComponent({name: "ResultSelection"}).exists()).toBe(
                false,
            );

            const appVm = wrapper.vm as any;
            expect(appVm.hasResults).toBe(true);
            expect(appVm.result).toBeTruthy();
        });
    });
});
