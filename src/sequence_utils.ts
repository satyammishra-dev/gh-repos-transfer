import generateRepoData from "./generateRepoData.js";
import { NewRepository, OldRepository } from "./types.js";
import fs from "fs";
import multiSelect from "./multiSelect.js";
import { Octokit } from "octokit";
import chalk from "chalk";
import { generateLog, parseError } from "./utils.js";
import copyRepository from "./copyRepository.js";

// This is a hack to get the type of the octokit instance
const uselessOctokitInstance = new Octokit({
  auth: "useless",
});
export type OctokitInstance = typeof uselessOctokitInstance;

export const getOldOwnerUsername = () => {
  let exists;
  try {
    exists = fs.existsSync("repositories");
  } catch {
    throw new Error("Unable to locate or read repositories directory.");
  }
  if (!exists) {
    throw new Error("Unable to locate or read repositories directory.");
  } else {
    const files = fs.readdirSync("repositories");
    if (files.length === 0) {
      throw new Error("repositories directory is empty.");
    } else if (files.length > 1) {
      throw new Error(
        "repositories directory must only contain one directory named after the username of previous owner."
      );
    } else {
      const username = files[0];
      const repositories = fs.readdirSync(`repositories/${username}`);
      if (repositories.length === 0) {
        throw new Error(`No repositories found in repositories/${username}.`);
      } else {
        return username;
      }
    }
  }
};

export const checkFileRequisites = () => {
  try {
    const exists = fs.existsSync("repositories_000001.json");
    if (!exists) {
      throw new Error("Unable to locate or read repositories_000001.json");
    }
  } catch {
    throw new Error("Unable to locate or read repositories_000001.json");
  }
  getOldOwnerUsername();
};

export const locateAndParseReposData = () => {
  const file = fs.readFileSync("repositories_000001.json");

  let parsedData: OldRepository[];
  try {
    parsedData = JSON.parse(file.toString());
  } catch (err) {
    throw new Error("Invalid JSON file");
  }

  if (!Array.isArray(parsedData)) {
    console.error("Invalid data in JSON file.");
  }
  return parsedData;
};

export const askAndGetReposToExport = async (repos: OldRepository[]) => {
  const repoNames = repos
    .filter((repo) => repo.name !== undefined)
    .map((repo) => repo.name) as string[];
  repoNames.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  const selectedRepos = await multiSelect(
    repoNames,
    "Select repositories to export."
  );
  const selectedRepoSet = new Set(selectedRepos);
  const reposToExport = repos.filter((repo) => {
    if (repo.name === undefined) return false;
    return selectedRepoSet.has(repo.name);
  });
  return reposToExport;
};

export const createRepository = async (
  octokit: OctokitInstance,
  repositoryOptions: NewRepository
) => {
  await octokit.request("POST /user/repos", {
    ...repositoryOptions,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};

export const exportRepository = async (
  octokit: OctokitInstance,
  username: string,
  repo: OldRepository
): Promise<boolean> => {
  generateLog(`Starting export for ${repo.name}...`);
  console.log(chalk.dim(`\nExporting ${repo.name}...`));
  console.log(chalk.dim(`> Trying to create repository...`));
  try {
    const repoOptions = generateRepoData(repo);
    await createRepository(octokit, repoOptions);
    console.log(chalk.dim("> Repository created successfully."));
    generateLog(`New repository created: ${repoOptions.name}`);
    await copyRepository(username, repoOptions.name);
    generateLog(`Export successful.`);
    return true;
  } catch (err) {
    console.log(chalk.red("Failed."));
    console.log(chalk.dim("See gh-export.log for the complete log."));
    generateLog(`Error: ${parseError(err)}`);
    return false;
  }
};
