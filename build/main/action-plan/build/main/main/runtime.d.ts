import { Matrix } from "../common/types.js";
export type EvalPlanParams = {
    planFile: string;
    plan: string;
};
export declare const evalPlan: (params: EvalPlanParams) => Promise<Matrix | any>;
//# sourceMappingURL=runtime.d.ts.map