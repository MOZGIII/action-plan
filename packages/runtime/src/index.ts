import path from "path";
import { Matrix } from "@action-plan/core";

export type EvalPlanParams = {
  planFile: string;
  plan: string;
};

export const evalPlan = async (
  params: EvalPlanParams,
): Promise<Matrix | any> => {
  const { planFile, plan } = params;

  const rootFile = path.resolve(process.cwd(), planFile);

  const moduleExports = await import(rootFile);

  const planFn = moduleExports[plan];

  if (planFn === undefined) {
    throw new Error(`Unable to find plan "${plan}"`);
  }

  if (typeof planFn !== "function") {
    let messageDetails = "";
    try {
      messageDetails = `: ${JSON.stringify(planFn)}`;
    } catch {}

    throw new Error(
      `Found plan "${plan}" but it is not a function (was "${typeof planFn}"${messageDetails})`,
    );
  }

  return await planFn();
};
