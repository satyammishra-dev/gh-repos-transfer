import * as readline from "readline";
import chalk from "chalk";
import { exec } from "child_process";
import * as fs from "fs";

export const isObject = (value: any): value is object => {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof RegExp) &&
    !(value instanceof Date) &&
    !(value instanceof Set) &&
    !(value instanceof Map)
  );
};

export function execShellCommand(cmd: string, options = {}) {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || stdout));
      } else {
        resolve(stdout ? stdout : stderr);
      }
    });
  });
}

export const promptUser = (question: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(chalk.cyan(question), (answer) => {
      resolve(answer);
      rl.close();
    });
  });
};

export const generateLog = (
  message: string,
  timeStamp?: boolean,
  append?: boolean
) => {
  try {
    timeStamp = timeStamp ?? true;
    append = append ?? true;

    if (!fs.existsSync("gh-export.log")) {
      fs.writeFileSync("gh-export.log", "");
    }

    const finalMessage = timeStamp
      ? `[${new Date().toISOString()}]: ${message}`
      : message;

    if (append) {
      fs.appendFileSync("gh-export.log", `${finalMessage}\n`);
    } else {
      fs.writeFileSync("gh-export.log", `${finalMessage}\n`);
    }
  } catch {}
};

export const booleanPromptUser = (question: string): Promise<boolean> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(chalk.cyan(`${question} [y/n]: `), (answer) => {
      const value = answer.toLowerCase() === "y";
      resolve(value);
      rl.close();
    });
  });
};

export const parseError = (err: any) => {
  try {
    const message = (err as any).message as string;
    return message ?? (err as string);
  } catch {
    return err as string;
  }
};

export const getDirname = () => process.cwd();
