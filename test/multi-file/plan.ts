import platform from "./platform.ts";
import mode from "./mode.ts";

console.log("plan:yes");

export default () => ({
  mode,
  platform,
});
