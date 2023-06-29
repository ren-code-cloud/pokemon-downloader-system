import { promptUser } from "./prompts.js"
import chalk from "chalk";

console.log(
  chalk.gray(`
  ========== ${chalk.red("POKEMON DOWNLOADER")} ===========
  `));
promptUser();