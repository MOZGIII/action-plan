import path from "path";
export const evalPlan = async (params) => {
    const { planFile, plan } = params;
    const rootFile = path.resolve(process.cwd(), planFile);
    const moduleExports = await import(rootFile);
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