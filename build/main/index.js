import core from "@actions/core";
import { evalPlan } from "./runtime.js";
const main = async () => {
    const planFile = core.getInput("plan_file", {}) ||
        core.getInput("plan-file", { required: true });
    console.log(`Loading plan file ${planFile} at ${process.cwd()}`);
    const tsconfig = core.getInput("tsconfig") || undefined;
    const plan = core.getInput("plan", { required: true });
    const computedMatrix = await evalPlan({ planFile, plan, tsconfig });
    core.setOutput("matrix", computedMatrix);
};
const handleError = (error) => {
    const info = error.stack?.toString() || error.toString();
    const logErrors = process.env["LOG_ERRORS"];
    if (Boolean(logErrors)) {
        console.error(info);
    }
    core.setFailed(info);
};
process.on("unhandledRejection", handleError);
main().catch(handleError);
//# sourceMappingURL=index.js.map