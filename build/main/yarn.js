import { spawn } from "child_process";
import { stat } from "fs/promises";
export const ensurePackagesInstalled = async () => {
    const shouldSkipInstall = await nodeModulesExists();
    if (!shouldSkipInstall) {
        await installPackages();
    }
};
export const nodeModulesExists = async () => {
    const stats = await stat("node_modules");
    return stats.isDirectory() || stats.isSymbolicLink();
};
export const installPackages = async () => spawnSimple("yarn", ["install", "--immutable", "--immutable-cache"], {
    stdio: "inherit",
    windowsHide: true,
});
const spawnSimple = (command, args, options) => new Promise((resolve, reject) => {
    const child = spawn(command, args, options);
    child.on("error", reject);
    child.on("close", resolve);
});
//# sourceMappingURL=yarn.js.map