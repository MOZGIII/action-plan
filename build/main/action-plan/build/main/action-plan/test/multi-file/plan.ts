const platform = await require("./platform");
const mode = await require("./mode");

console.log("plan:yes");

export default () => ({
  mode,
  platform,
});
