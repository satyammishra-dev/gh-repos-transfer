import * as readline from "readline";
import chalk from "chalk";

interface Option {
  value: string;
  selected: boolean;
  isAll?: boolean;
}

export default async function multiSelect(
  options: string[],
  title?: string
): Promise<string[]> {
  if (!process.stdin.isTTY) {
    throw new Error("This function must be run in a TTY environment");
  }

  let items: Option[] = [
    { value: "All", selected: false, isAll: true },
    ...options.map((opt) => ({
      value: opt,
      selected: false,
    })),
  ];

  let currentIndex = 0;

  // Store the keypress handler reference so we can remove it later
  let keypressHandler: (str: string, key: any) => void;

  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Configure terminal
  process.stdin.setRawMode(true);
  process.stdin.resume();

  function toggleAll(selected: boolean) {
    items.forEach((item) => {
      item.selected = selected;
    });
  }

  function getWindowedItems(items: Option[], currentIndex: number): Option[] {
    const reservedLines = (title ? 2 : 1) + 2 + 2 + 1 + 1;
    const terminalHeight = process.stdout.rows;
    const availableHeight = terminalHeight - reservedLines;

    const windowSize = Math.min(availableHeight, items.length);
    const halfWindow = Math.floor(windowSize / 2);

    let startIdx = Math.max(0, currentIndex - halfWindow);
    let endIdx = Math.min(items.length, startIdx + windowSize);

    if (endIdx === items.length) {
      startIdx = Math.max(0, endIdx - windowSize);
    }

    return items.slice(startIdx, endIdx);
  }

  return new Promise<string[]>((resolve) => {
    function render() {
      console.clear();

      if (title) {
        console.log(chalk.cyan(title));
      }
      console.log(
        chalk.cyan(
          "Use ↑/↓ to navigate, SPACE to select/deselect, ENTER to confirm\n"
        )
      );

      const windowedItems = getWindowedItems(items, currentIndex);
      const startIdx = items.indexOf(windowedItems[0]);

      if (startIdx > 0) {
        console.log(chalk.dim("  ↑ more items ↑"));
      }

      windowedItems.forEach((item) => {
        const absoluteIdx = items.indexOf(item);
        const selectionMark = item.selected ? "*" : " ";
        const value =
          absoluteIdx === currentIndex ? chalk.bgCyan(item.value) : item.value;

        console.log(`[${selectionMark}] ${value}`);
      });

      if (startIdx + windowedItems.length < items.length) {
        console.log(chalk.dim("  ↓ more items ↓"));
      }

      const selectedCount = items.filter(
        (item) => item.selected && !item.isAll
      ).length;
      console.log(
        chalk.dim(`\nSelected: ${selectedCount} / ${items.length - 1}`)
      );
    }

    function cleanup() {
      // Remove our specific keypress listener
      process.stdin.removeListener("keypress", keypressHandler);

      // Restore terminal state
      process.stdin.setRawMode(false);
      process.stdin.pause();

      // Close our readline interface
      rl.close();

      // Remove readline's keypress listener
      readline.emitKeypressEvents(process.stdin);

      // Clear the screen one last time to prevent artifacts
      console.clear();
    }

    // Define keypress handler
    keypressHandler = (str: string, key: any) => {
      if (key.ctrl && key.name === "c") {
        cleanup();
        process.exit();
      }

      switch (key.name) {
        case "up":
          currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          break;

        case "down":
          currentIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          break;

        case "space":
          const currentItem = items[currentIndex];
          const newSelectedState = !currentItem.selected;

          if (currentItem.isAll) {
            toggleAll(newSelectedState);
          } else {
            currentItem.selected = newSelectedState;

            const allOthersSelected = items
              .slice(1)
              .every((item) => item.selected);
            items[0].selected = allOthersSelected;
          }
          break;

        case "return":
          const selectedItems = items
            .filter((item) => item.selected && !item.isAll)
            .map((item) => item.value);
          cleanup();
          resolve(selectedItems);
          return;
      }

      render();
    };

    // Attach keypress handler
    process.stdin.on("keypress", keypressHandler);

    // Initial render
    render();
  });
}
