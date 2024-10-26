import path from "path";
import { execShellCommand, getDirname } from "./utils.js";
import { simpleGit } from "simple-git";
import * as fs from "fs";
import chalk from "chalk";
import { getOldOwnerUsername } from "./sequence_utils.js";

const __dirname = getDirname();

async function copyRepository(userName: string, repoName: string) {
  const NEW_ACCOUNT_SSH_URL_PREFIX = `git@github.com:${userName}/`;
  const newRepoURL = `${NEW_ACCOUNT_SSH_URL_PREFIX}${repoName}.git`;

  console.log(chalk.dim("> Checking if repository exists on system..."));
  const oldOwner = getOldOwnerUsername();

  const repoDir = path.join(
    __dirname,
    "repositories",
    oldOwner,
    `${repoName}.git`
  );

  let repositoryExists;
  try {
    repositoryExists = fs.existsSync(repoDir);
  } catch {
    throw new Error("Could not check if repository exists.");
  }

  if (repositoryExists) {
    console.log(chalk.dim("> Repository found on system."));
  } else {
    console.log(
      chalk.dim("> Repository could not be found on system. Aborting copy.")
    );
    throw new Error("Repository could not be found on system.");
  }

  try {
    const git = simpleGit(repoDir);

    // Set the new remote origin
    console.log(chalk.dim("> Attempting to copy repository..."));
    await git.remote(["set-url", "origin", newRepoURL]);

    // Push all branches
    console.log(chalk.dim("> Copying branches..."));
    await execShellCommand(`git push --prune --all ${newRepoURL}`, {
      cwd: repoDir,
    });

    // Push all tags
    console.log(chalk.dim("> Copying tags..."));
    await execShellCommand(`git push --tags ${newRepoURL}`, { cwd: repoDir });
  } catch (error) {
    console.log(chalk.red("An error occured while copying the repository."));
    throw error;
  }
}

export default copyRepository;
