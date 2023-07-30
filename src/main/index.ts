import core from "@actions/core";
import { evalPlan } from "./runtime.js";

const input = <const Key extends string>(key: Key): string => {
  const val = process.env[key];
  if (val === undefined) {
    throw new Error(`Input parameter required but was not provided: {key}`);
  }
  return val;
};

const main = async () => {
  const planFile = input("INPUT_PLAN_FILE");
  console.log(`Loading plan file ${planFile} at ${process.cwd()}`);

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
