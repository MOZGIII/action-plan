import { Service, create } from "ts-node";
import { readFile } from "fs/promises";
import path from "path";
import { readFileSync } from "fs";
import nodeModule from "module";
import root from "../common/root.js";

export type CreateCompilerParams = {
  rootFile: string;
  tsconfig: string | undefined;
};

export const createCompiler = (params: CreateCompilerParams): Service => {
  const {
    rootFile: _,
    tsconfig = path.resolve(root, "tsconfig.runtime.json"),
  } = params;

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

export const compileCode = (
  code: string,
  file: string,
  service: Service,
): string => {
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

const makeCreateRequire = (service: Service, fromFile: string) => {
  const fromDir = path.dirname(fromFile);
  const ourRequire = (file: string) =>
    importModuleSync(path.resolve(fromDir, file + ".ts"), service, {});
  const nodeRequire = nodeModule.createRequire(path.resolve(fromFile));

  return (file: string) => {
    return path.isAbsolute(file) || file.startsWith(".")
      ? ourRequire(file)
      : nodeRequire(file);
  };
};

const makeModuleWrapperArgs = <C extends Record<string, any>>(
  file: string,
  require: (file: string) => any,
  context: C,
) => {
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

export type ImportedModule = {
  exports: { [x: string]: any };
};

export const importModule = async <C extends Record<string, any>>(
  file: string,
  service: Service,
  context: C,
): Promise<ImportedModule> => {
  const rawCode = await readFile(file, { encoding: "utf8" });
  const code = await compileCode(rawCode, file, service);

  const require = makeCreateRequire(service, file);

  const wrapperArgs = makeModuleWrapperArgs(file, require, context);

  await callAsyncFunction(code, wrapperArgs);

  return wrapperArgs.module;
};

export const importModuleSync = <C extends Record<string, any>>(
  file: string,
  service: Service,
  context: C,
): ImportedModule => {
  const rawCode = readFileSync(file, { encoding: "utf8" });
  const code = compileCode(rawCode, file, service);

  const require = makeCreateRequire(service, file);

  const wrapperArgs = makeModuleWrapperArgs(file, require, context);

  callFunction(code, wrapperArgs);

  return wrapperArgs.module;
};

const AsyncFunction = Object.getPrototypeOf(async () => null).constructor;

export function callAsyncFunction<Args extends Record<string, any>>(
  source: string,
  args: Args,
): Promise<any> {
  const fn = new AsyncFunction(...Object.keys(args), source);
  return fn(...Object.values(args));
}

const Function = Object.getPrototypeOf(() => null).constructor;

export function callFunction<Args extends Record<string, any>>(
  source: string,
  args: Args,
): any {
  const fn = new Function(...Object.keys(args), source);
  return fn(...Object.values(args));
}
