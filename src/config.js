// API 관리 Config
const API_BASE_URL = "http://localhost:8080";

const API = {
  USER_REPOS: `${API_BASE_URL}/githubs/users/repos`,
  ORG_LIST: `${API_BASE_URL}/githubs/users/org`,
  ORG_REPOS: (orgName) => `${API_BASE_URL}/githubs/users/${orgName}/repos`,
  COMMITS: (owner, repo) => `${API_BASE_URL}/githubs/${owner}/${repo}/commits`,
  COMMIT_DETAILS: (owner, repo, commitId) =>
    `${API_BASE_URL}/githubs/${owner}/${repo}/commits/${commitId}/details`,
  CREATE_RECORD: `${API_BASE_URL}/records/`,
};

export default API;
