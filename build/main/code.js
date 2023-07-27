import { create } from "ts-node";
import { readFile } from "fs/promises";
import path from "path";
import { readFileSync } from "fs";
import nodeModule from "module";
import root from "../common/root.js";
export const createCompiler = (params) => {
    const { rootFile: _, tsconfig = path.resolve(root, "tsconfig.runtime.json"), } = params;
    return create({
        project: tsconfig,
        esm: true,
        compilerOptions: {
            // The way we interact with the file requires that it is built as
            // a NodeNext module. This can be changed as long as we can load and run
            // the file.
            module: "NodeNext",
            // To allow loading files without an extension.
            moduleResolution: "Bundler",
        },
    });
};
export const compileCode = (code, file, service) => {
    const logRawCode = process.env["LOG_RAW_CODE"];
    if (Boolean(logRawCode)) {
        console.log(code);
    }
    const compiledCode = service.compile(code, file);
    const logCode = process.env["LOG_CODE"];
    if (Boolean(logCode)) {
        console.log(compiledCode);
    }
    return compiledCode;
};
const makeCreateRequire = (service, fromFile) => {
    const fromDir = path.dirname(fromFile);
    const ourRequire = (file) => importModuleSync(path.resolve(fromDir, file + ".ts"), service, {});
    const nodeRequire = nodeModule.createRequire(path.resolve(fromFile));
    return (file) => {
        return path.isAbsolute(file) || file.startsWith(".")
            ? ourRequire(file)
            : nodeRequire(file);
    };
};
const makeModuleWrapperArgs = (file, require, context) => {
    const exports = {};
    const module = { exports };
    const wrapperArgs = {
        exports,
        require,
        module,
        __filename: file,
        __dirname: path.dirname(file),
        ...context,
    };
    return wrapperArgs;
};
export const importModule = async (file, service, context) => {
    const rawCode = await readFile(file, { encoding: "utf8" });
    const code = await compileCode(rawCode, file, service);
    const require = makeCreateRequire(service, file);
    const wrapperArgs = makeModuleWrapperArgs(file, require, context);
    await callAsyncFunction(code, wrapperArgs);
    return wrapperArgs.module;
};
export const importModuleSync = (file, service, context) => {
    const rawCode = readFileSync(file, { encoding: "utf8" });
    const code = compileCode(rawCode, file, service);
    const require = makeCreateRequire(service, file);
    const wrapperArgs = makeModuleWrapperArgs(file, require, context);
    callFunction(code, wrapperArgs);
    return wrapperArgs.module;
};
const AsyncFunction = Object.getPrototypeOf(async () => null).constructor;
export function callAsyncFunction(source, args) {
    const fn = new AsyncFunction(...Object.keys(args), source);
    return fn(...Object.values(args));
}
const Function = Object.getPrototypeOf(() => null).constructor;
export function callFunction(source, args) {
    const fn = new Function(...Object.keys(args), source);
    return fn(...Object.values(args));
}
//# sourceMappingURL=code.js.map