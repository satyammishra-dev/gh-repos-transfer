# gh-repos-transfer

**gh-repos-transfer** is a Node.js CLI tool to transfer repositories from one GitHub account to another. This tool works effectively even for flagged GitHub accounts, which may face restrictions in transferring repositories or managing ownership. By leveraging GitHub's data export feature, **gh-repos-transfer** automates the process of recreating and pushing repositories to a new GitHub account.

## Features

- **Flagged Account Transfer:** Supports repository export and transfer even if the source account is flagged.
- **Configurable Authentication:** Uses GitHub Personal Access Token (PAT) for secure API access.
- **Interactive Repository Selection:** Choose specific repositories to transfer using an interactive CLI.
- **Batch Processing:** Option to manually confirm after each repo or proceed automatically.
- **Detailed Logs:** Provides error logs in `gh-export.log` for review if issues arise.
- **Platform Compatibility:** Available as executables for Linux, macOS, and Windows, or can be run from the cloned repository.

## How It Works

To successfully transfer repositories, follow these steps:

### 1. Export Your Data from GitHub

- Navigate to **Settings** > **Export account data**.
- Follow GitHub’s prompts to initiate an export. You’ll receive an email with a download link when the export is complete.

### 2. Download and Prepare Your Data

- Download the exported data from the link in the GitHub email.
- Uncompress the downloaded file to reveal a folder with the data, including the repositories and a `repositories_000001.json` file.

### 3. Download or Clone **gh-repos-transfer**

- You have two options: download an executable or clone the repository:
  - **Executable**: Download the executable file for your operating system from the [releases page](/releases/latest).
  - **Clone**: Use `git clone` to clone the repository locally, then run `npm install` to install dependencies.

### 4. Set Up the Working Directory

- If using the cloned version, place the `repositories` folder and `repositories_000001.json` file in the project workspace.
- If using the executable, move the executable file into the uncompressed GitHub export folder.

### 5. Configure SSH for New Account

- Set up SSH access for the new GitHub account on your machine. Follow [GitHub’s SSH setup guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) for detailed instructions.

### 6. Start the Tool

- **Cloned Version**: Run `npm start` to begin.
- **Executable Version**:
  - On Linux: `./gh-repos-transfer-linux`
  - On macOS: `./gh-repos-transfer-macos`
  - On Windows: `.\gh-repos-transfer-win.exe`

### 7. Authentication & Account Setup

- The tool will prompt for the new GitHub account’s **Personal Access Token** and **username**.
- To skip the prompt, set these as environment variables:
  ```
  export GH_PAT=<your_personal_access_token>
  export GH_USERNAME=<new_github_username>`
  ```

### 8. Select Repositories to Transfer

- The CLI will list all available repositories. Use the **up and down arrow keys** to scroll, **space** to select/deselect, and **Enter** to confirm your selection.

### 9. Set Transfer Mode

- Choose whether to **wait for user input** after each repository transfer or proceed automatically through all selected repositories.

### 10. Begin Transfer Process

- The tool will start transferring selected repositories. Any issues or errors will be logged in `gh-export.log`.

## License

This project is licensed under the MIT License.

## Additional Notes

- Please ensure you’ve correctly set up SSH and Personal Access Tokens for secure, reliable access to your new GitHub account.
- For detailed transfer information, consult `gh-export.log` after each transfer run.

Happy migrating!
