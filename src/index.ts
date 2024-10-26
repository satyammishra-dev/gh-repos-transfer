import { Octokit } from "octokit";
import chalk from "chalk";
import {
  booleanPromptUser,
  generateLog,
  parseError,
  promptUser,
} from "./utils.js";
import {
  askAndGetReposToExport,
  checkFileRequisites,
  exportRepository,
  locateAndParseReposData,
} from "./sequence_utils.js";

import "dotenv/config";

const main = async () => {
  // Clear the console.
  console.clear();

  // Get credentials
  if (
    !process.env.GH_PAT ||
    !process.env.GH_USERNAME ||
    process.env.SHOW_CRED_PROMPT
  ) {
    console.log(
      chalk.yellow(
        "\nSet environment variables for GH_PAT and GH_USERNAME to skip prompts every time.\n"
      )
    );
  }
  let { GH_PAT, GH_USERNAME } = process.env;
  if (process.env.SHOW_CRED_PROMPT || !GH_PAT) {
    GH_PAT = await promptUser("Enter your github personal access token: ");
  }
  if (process.env.SHOW_CRED_PROMPT || !GH_USERNAME) {
    GH_USERNAME = await promptUser("Enter your github username: ");
  }

  if (!GH_PAT || !GH_USERNAME) {
    throw new Error("Missing credentials.");
  }

  // Initialize the octokit instance
  const octokit = new Octokit({
    auth: GH_PAT,
  });

  // Checking for pre-requisites
  console.log(
    chalk.dim("\nReading repositories_000001.json and repositories directory.")
  );
  checkFileRequisites();

  // Parse repositories Data
  const parsedData = locateAndParseReposData();
  if (parsedData.length === 0) {
    console.log(chalk.dim("\nNo repositories to export. Exitting..."));
    return;
  }

  // Ask user to select repositories to export
  const reposToExport = await askAndGetReposToExport(parsedData);
  if (reposToExport.length === 0) {
    console.log(chalk.dim("\nNo repositories to export. Exitting..."));
    return;
  }

  // Generating logs and asking pre-export prompts
  generateLog("\n\n====================\n", false);
  generateLog(`Exporting ${reposToExport.length} repositories.`);
  const waitPerExport = await booleanPromptUser(
    "Wait for user input after every export?"
  );
  console.log(chalk.green("\nExporting repositories..."));

  // Exporting repositories
  let failedCount = 0;
  let successCount = 0;
  let cancelledCount = reposToExport.length;
  for (let i = 0; i < reposToExport.length; i++) {
    const repo = reposToExport[i];
    const isSuccess = await exportRepository(octokit, GH_USERNAME, repo);
    if (isSuccess) {
      successCount += 1;
    } else {
      failedCount += 1;
    }
    cancelledCount -= 1;
    if (waitPerExport && i < reposToExport.length - 1) {
      const waitInput = await booleanPromptUser(
        "Continue to next repository export?"
      );
      if (!waitInput) break;
    }
  }

  // Generating stats
  const statsMessage = `Exported ${successCount} repositories successfully, ${failedCount} failed, and ${cancelledCount} cancelled.`;
  console.log(chalk.green("\n" + statsMessage));
  generateLog(statsMessage);
};

main().catch((err) => {
  console.log(chalk.bgRed(parseError(err)));
});
