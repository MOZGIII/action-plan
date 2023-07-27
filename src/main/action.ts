import { resolve } from "path";

export const resolveWorkspacePath = (path: string): string => {
  const workspace = process.env["GITHUB_WORKSPACE"];
  if (!workspace) {
    // Must not be running in the action, bail immediately to signal the error.
    throw new Error("GITHUB_WORKSPACE is not set, refusing to proceed");
  }

  return resolve(workspace, path);
};
