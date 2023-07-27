import { createCompiler, importModule } from "./code.js";
export const evalPlan = async (params) => {
    const { planFile, plan, tsconfig } = params;
    const service = createCompiler({
        rootFile: planFile,
        tsconfig,
    });
    const { exports: moduleExports } = await importModule(planFile, service, {});
    if (typeof moduleExports !== "object" || moduleExports == null) {
        throw new Error("Invalid default export, must be a map of plans");
    }
    const planFn = moduleExports[plan];
    if (planFn === undefined) {
        throw new Error(`Unable to find plan "${plan}"`);
    }
    if (typeof planFn !== "function") {
        throw new Error(`Found plan ${plan} but it is not a function (was ${typeof planFn})`);
    }
    return await planFn();
};
//# sourceMappingURL=runtime.js.map