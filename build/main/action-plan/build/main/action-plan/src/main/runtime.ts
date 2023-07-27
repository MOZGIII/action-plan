import { Matrix } from "../common/types.js";
import { createCompiler, importModule } from "./code.js";

export type EvalPlanParams = {
  planFile: string;
  plan: string;
};

export const evalPlan = async (
  params: EvalPlanParams,
): Promise<Matrix | any> => {
  const { planFile, plan } = params;

  const service = createCompiler(planFile);

  const { exports: moduleExports } = await importModule(planFile, service, {});

  if (typeof moduleExports !== "object" || moduleExports == null) {
    throw new Error("Invalid default export, must be a map of plans");
  }

  const planFn = moduleExports[plan];

  if (planFn === undefined) {
    throw new Error(`Unable to find plan "${plan}"`);
  }

  if (typeof planFn !== "function") {
    throw new Error(
      `Found plan ${plan} but it is not a function (was ${typeof planFn})`,
    );
  }

  return await planFn();
};
