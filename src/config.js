// API 관리 Config
const API_BASE_URL = "http://localhost:8080";

const API = {
  // GitHub 관련
  USER_REPOS: `${API_BASE_URL}/githubs/users/repos`,
  ORG_LIST: `${API_BASE_URL}/githubs/users/org`,
  ORG_REPOS: (orgName) => `${API_BASE_URL}/githubs/users/${orgName}/repos`,

  // 브랜치 목록 조회
  GET_BRANCHES: (owner, repo) =>
    `${API_BASE_URL}/githubs/${owner}/${repo}/branches`,

  // 커밋 목록 조회 (이제 branch가 필수)
  COMMITS: (owner, repo, branch) =>
    `${API_BASE_URL}/githubs/${owner}/${repo}/${branch}/commits`,

  // 커밋 상세 조회
  COMMIT_DETAILS: (owner, repo, commitId) =>
    `${API_BASE_URL}/githubs/${owner}/${repo}/commits/${commitId}/details`,

  // 글 기록 (레코드)
  CREATE_RECORD: `${API_BASE_URL}/records/`,
  EDIT_RECORD: (recordId) => `${API_BASE_URL}/records/edit/${recordId}`,
  GET_RECORD: (recordId) => `${API_BASE_URL}/records/${recordId}`,
  GET_RECORD_LIST: `${API_BASE_URL}/records/list`,
  DELETE_RECORD: (recordId) => `${API_BASE_URL}/records/delete/${recordId}`,

  // 사용자 인증
  SIGNIN: `${API_BASE_URL}/users/signin`,
  SIGNUP: `${API_BASE_URL}/users/signup`,
  REGISTER_GITHUB: `${API_BASE_URL}/users/register/github`,
};

export default API;
