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

  // 에러 정보 조회
  ERROR_INFO_LIST: (commitId) =>
    `${API_BASE_URL}/errors/errorInfoList/${commitId}`,

  // 에러 코드 리스트 조회 by errorInfoId
  ERROR_CODE_LIST: (errorInfoId) =>
    `${API_BASE_URL}/errors/errorCodeList/${errorInfoId}`,

  // 에러 해결과정 코드 리스트 조회 by errorInfoId
  ERROR_SOLVED_CODE_LIST: (errorInfoId) =>
    `${API_BASE_URL}/errors/errorSolvedCodeList/${errorInfoId}`,

  // 커밋 당시 전체 코드 조회 by owner, repo, filePath + commitId
  GET_SOURCE: (owner, repo, filePath, commitId) =>
    `${API_BASE_URL}/githubs/${owner}/${repo}/file?filePath=${encodeURIComponent(
      filePath
    )}&commitId=${commitId}`,

    // 커밋 ID로 코드블럭 리스트 조회
  GET_CODE_BLOCKS: (commitId) =>
  `${API_BASE_URL}/codes/blocks/${commitId}`,


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
