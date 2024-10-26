import { NewRepository } from "./types.js";

export const DEFAULT_REPOSITORY_DATA: Omit<NewRepository, "name"> = {
  description: "",
  homepage: "",
  private: false,
  has_issues: true,
  has_projects: false,
  has_wiki: true,
  has_discussions: false,
  team_id: 0,
  auto_init: false,
  gitignore_template: "",
  license_template: "",
  allow_squash_merge: true,
  allow_merge_commit: true,
  allow_rebase_merge: true,
  allow_auto_merge: false,
  delete_branch_on_merge: false,
  squash_merge_commit_title: "PR_TITLE",
  squash_merge_commit_message: "PR_BODY",
  merge_commit_title: "PR_TITLE",
  merge_commit_message: "PR_TITLE",
  has_downloads: true,
  is_template: false,
};