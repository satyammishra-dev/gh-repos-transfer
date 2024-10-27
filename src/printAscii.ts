import chalk, { ChalkInstance } from "chalk";

const asciiLogo = `
   :==:                 
  #@**@#======-         
  #@*+@%++++++%@=       
   -==:        @@       
         -===+%@=       
       =@%+++=-         
       @@        :==:   
       =@%+=====#@@@@#  
         -=+++++#@@@@#  
                 :==-   
`;

const descriptionLines = [
  [],
  [chalk.yellow.bold("gh-repos-transfer")],
  [chalk.dim("v1.0.0")],
  [""],
  [
    chalk.yellowBright(
      "A quick CLI tool to transfer all your github repositories"
    ),
  ],
  [chalk.yellowBright("from one account to another.")],
  [""],
  [
    chalk.white("Visit"),
    chalk.cyan.underline(
      "https://github.com/satyammishra-dev/gh-repos-transfer"
    ),
  ],
  [chalk.white("for more information.")],
  [""],
  [chalk.magenta("-made by"), chalk.magenta.bold("Satyam Mishra")],
  [""],
] satisfies (ChalkInstance | string)[][];

const printAscii = () => {
  const asciiLogoLines = asciiLogo.split("\n");
  const isFirstOrLastIndex = (index: number) =>
    index === 0 || index === asciiLogoLines.length - 1;
  for (let i = 0; i < asciiLogoLines.length; i++) {
    const descriptionLine =
      i < descriptionLines.length ? descriptionLines[i] : [];
    console.log(
      chalk.cyanBright(asciiLogoLines[i]),
      chalk.dim(isFirstOrLastIndex(i) ? "" : ` ||  `),
      ...descriptionLine
    );
  }
};

export default printAscii;
