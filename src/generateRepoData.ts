import { DEFAULT_REPOSITORY_DATA } from "./constants.js";
import { NewRepository, OldRepository } from "./types.js";
import { isObject } from "./utils.js";

const generateRepoData = (
  oldRepoData: OldRepository,
  overwriteProperties?: Partial<NewRepository>
) => {
  if (!isObject(oldRepoData)) {
    throw new Error("Invalid old repository data");
  }
  if (
    oldRepoData.name === undefined &&
    typeof overwriteProperties?.name !== "string"
  ) {
    throw new Error("Repository name is invalid or not present.");
  }
  let {
    name,
    description,
    website,
    private: isPrivate,
    has_issues,
    has_wiki,
    has_projects,
    has_discussions,
    general_settings,
    has_downloads,
    is_template,
  } = oldRepoData;

  if (!isObject(general_settings)) {
    general_settings = undefined;
  }

  let isOverwritePropertiesValid = true;
  if (isObject(overwriteProperties)) {
    isOverwritePropertiesValid = false;
  }

  const getOverwrittenValue = (
    key: keyof NewRepository,
    oldValue: OldRepository[keyof OldRepository]
  ) => {
    if (isOverwritePropertiesValid) {
      const value = (overwriteProperties as Partial<NewRepository>)?.[key];
      if (value !== undefined && value !== null) return value;
    }
    return oldValue;
  };

  const unverifiedNewRepoData: NewRepository = {
    name: getOverwrittenValue("name", name) as string,
    description: getOverwrittenValue("description", description),
    homepage: getOverwrittenValue("homepage", website),
    private: getOverwrittenValue("private", isPrivate),
    has_issues: getOverwrittenValue("has_issues", has_issues),
    has_projects: getOverwrittenValue("has_projects", has_projects),
    has_wiki: getOverwrittenValue("has_wiki", has_wiki),
    has_discussions: getOverwrittenValue("has_discussions", has_discussions),
    team_id: getOverwrittenValue("team_id", undefined),
    allow_squash_merge: getOverwrittenValue(
      "allow_squash_merge",
      general_settings?.squash_merge
    ),
    allow_merge_commit: getOverwrittenValue(
      "allow_merge_commit",
      general_settings?.merge_commit
    ),
    allow_rebase_merge: getOverwrittenValue(
      "allow_rebase_merge",
      general_settings?.rebase_merge
    ),
    allow_auto_merge: getOverwrittenValue(
      "allow_auto_merge",
      general_settings?.auto_merge
    ),
    delete_branch_on_merge: getOverwrittenValue(
      "delete_branch_on_merge",
      general_settings?.delete_branch_heads
    ),

    has_downloads: getOverwrittenValue("has_downloads", has_downloads),
    is_template: getOverwrittenValue("is_template", is_template),
  };

  const trimRepoData = (data: NewRepository) => {
    const { name, ...rest } = data;
    const newObj: Partial<Omit<NewRepository, "name">> = {};
    for (const key in rest) {
      const keyOfRest = key as keyof typeof rest;
      if (rest[keyOfRest] === undefined) continue;
      if (rest[keyOfRest] === null) continue;
      const keyOfObj = key as keyof typeof newObj;
      if (typeof rest[keyOfRest] !== typeof DEFAULT_REPOSITORY_DATA[keyOfObj])
        continue;
      newObj[keyOfObj] = rest[keyOfRest] as any;
    }
    return newObj;
  };

  const newRepoData: NewRepository = {
    name: unverifiedNewRepoData.name,
    ...trimRepoData(unverifiedNewRepoData),
  };

  return newRepoData;
};

export default generateRepoData;
