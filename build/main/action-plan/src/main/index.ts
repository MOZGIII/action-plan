import core from "@actions/core";
import { evalPlan } from "./runtime.js";
import { ensurePackagesInstalled } from "./yarn.js";

const main = async () => {
  await ensurePackagesInstalled();

  const planFile =
    core.getInput("plan_file", {}) ||
    core.getInput("plan-file", { required: true });
  console.log(`Loading plan file ${planFile}`);

  const plan = core.getInput("plan", { required: true });

  const computedMatrix = await evalPlan({ planFile, plan });

  core.setOutput("matrix", computedMatrix);
};

const handleError = (error: Error) => {
  const info = error.stack?.toString() || error.toString();

  const logErrors = process.env["LOG_ERRORS"];
  if (Boolean(logErrors)) {
    console.error(info);
  }

  core.setFailed(info);
};

process.on("unhandledRejection", handleError);
main().catch(handleError);
