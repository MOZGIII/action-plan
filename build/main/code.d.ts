import { Service } from "ts-node";
export type CreateCompilerParams = {
    rootFile: string;
    tsconfig: string | undefined;
};
export declare const createCompiler: (params: CreateCompilerParams) => Service;
export declare const compileCode: (code: string, file: string, service: Service) => string;
export type ImportedModule = {
    exports: {
        [x: string]: any;
    };
};
export declare const importModule: <C extends Record<string, any>>(file: string, service: Service, context: C) => Promise<ImportedModule>;
export declare const importModuleSync: <C extends Record<string, any>>(file: string, service: Service, context: C) => ImportedModule;
export declare function callAsyncFunction<Args extends Record<string, any>>(source: string, args: Args): Promise<any>;
export declare function callFunction<Args extends Record<string, any>>(source: string, args: Args): any;
//# sourceMappingURL=code.d.ts.map