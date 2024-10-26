export type OldRepository = {
  name?: string;
  description?: string;
  website?: string | null;
  private?: boolean;
  has_issues?: boolean;
  has_wiki?: boolean;
  has_projects?: boolean;
  has_discussions?: boolean;
  general_settings?: {
    squash_merge?: boolean;
    merge_commit?: boolean;
    rebase_merge?: boolean;
    auto_merge?: boolean;
    delete_branch_heads?: boolean;
  };
  has_downloads?: boolean;
  is_template?: boolean;
} & {
  [key: string]: any;
};

export type NewRepository = {
  name: string; // Required: The name of the repository.
  description?: string; // Optional: A short description of the repository.
  homepage?: string; // Optional: A URL with more information about the repository.
  private?: boolean; // Optional: Whether the repository is private. Default: false
  has_issues?: boolean; // Optional: Whether issues are enabled. Default: true
  has_projects?: boolean; // Optional: Whether projects are enabled. Default: true
  has_wiki?: boolean; // Optional: Whether the wiki is enabled. Default: true
  has_discussions?: boolean; // Optional: Whether discussions are enabled. Default: false
  team_id?: number; // Optional: The id of the team that will be granted access to this repository.
  auto_init?: boolean; // Optional: Whether the repository is initialized with a minimal README. Default: false
  gitignore_template?: string; // Optional: The desired language or platform to apply to the .gitignore.
  license_template?: string; // Optional: The license keyword of the open source license for this repository.
  allow_squash_merge?: boolean; // Optional: Whether to allow squash merges for pull requests. Default: true
  allow_merge_commit?: boolean; // Optional: Whether to allow merge commits for pull requests. Default: true
  allow_rebase_merge?: boolean; // Optional: Whether to allow rebase merges for pull requests. Default: true
  allow_auto_merge?: boolean; // Optional: Whether to allow Auto-merge to be used on pull requests. Default: false
  delete_branch_on_merge?: boolean; // Optional: Whether to delete head branches when pull requests are merged. Default: false
  squash_merge_commit_title?: "PR_TITLE" | "COMMIT_OR_PR_TITLE"; // Required when using squash_merge_commit_message.
  squash_merge_commit_message?: "PR_BODY" | "COMMIT_MESSAGES" | "BLANK"; // The default value for a squash merge commit message.
  merge_commit_title?: "PR_TITLE" | "MERGE_MESSAGE"; // Required when using merge_commit_message.
  merge_commit_message?: "PR_TITLE" | "PR_BODY" | "BLANK"; // The default value for a merge commit message.
  has_downloads?: boolean; // Optional: Whether downloads are enabled. Default: true
  is_template?: boolean; // Optional: Whether this repository acts as a template that can be used to generate new repositories. Default: false
};
