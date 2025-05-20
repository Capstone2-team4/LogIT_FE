// API 관리 Config
const API_BASE_URL = "http://localhost:8080";

const API = {
  // GitHub 연관
  USER_REPOS: `${API_BASE_URL}/githubs/users/repos`,
  ORG_LIST: `${API_BASE_URL}/githubs/users/org`,
  ORG_REPOS: (orgName) => `${API_BASE_URL}/githubs/users/${orgName}/repos`,
  COMMITS: (owner, repo) => `${API_BASE_URL}/githubs/${owner}/${repo}/commits`,
  COMMIT_DETAILS: (owner, repo, commitId) =>
    `${API_BASE_URL}/githubs/${owner}/${repo}/commits/${commitId}/details`,

  // 글 기록 (레코드) 관련
  CREATE_RECORD: `${API_BASE_URL}/records/`, // POST
  EDIT_RECORD: (recordId) => `${API_BASE_URL}/records/edit/${recordId}`, // PATCH
  GET_RECORD: (recordId) => `${API_BASE_URL}/records/${recordId}`,
  GET_RECORD_LIST: `${API_BASE_URL}/records/list`, // GET 전체
  DELETE_RECORD: (recordId) => `${API_BASE_URL}/records/delete/${recordId}`, // DELETE
};

export default API;
