import API from "..";
import {
  IJobPostResponse,
  IJobPostFilters,
  IRecruitmentMasterData,
  ICreateJobPost,
  IApplicantResponse,
  IApplicantDetailResponse,
  IJobPostDetailResponse,
} from "./recruitment-types";

// Robust helper to format date as YYYY-MM-DD using local time
export const formatDateLocal = (date: Date | string | undefined) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export async function fetchAllJobPosts(
  filters?: IJobPostFilters
): Promise<IJobPostResponse> {
  const response = await API.post("Requitement/all-job-post", filters || {});
  return response.data;
}

export async function fetchRecruitmentMasterData(): Promise<IRecruitmentMasterData> {
  const response = await API.post("EmployeeManagement/master");
  return response.data;
}

export async function createJobPost(data: ICreateJobPost, files?: File[]) {
  const formData = new FormData();

  // Append all form data
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        // For arrays, append as JSON string or individual items
        formData.append(key, JSON.stringify(value));
      } else if (value instanceof Date) {
        formData.append(key, formatDateLocal(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  // Append files
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  // Don't set Content-Type header manually - axios will set it automatically with boundary
  const response = await API.post("Requitement/job-post", formData);
  return response.data;
}

export async function fetchAllApplicants(): Promise<IApplicantResponse> {
  const response = await API.post("Requitement/all-applicants");
  return response.data;
}

export async function fetchApplicantById(
  id: number | string
): Promise<IApplicantDetailResponse> {
  const response = await API.get(`Requitement/get-by-applicant/${id}`);
  return response.data;
}

export async function updateApplicantStatus(
  id: number | string,
  status: "1" | "2" // 1 for shortlist, 2 for rejected
) {
  const response = await API.post(`Requitement/update-applicant-status`, {
    applicantId: id.toString(),
    status: status,
  });
  return response.data;
}

export async function fetchJobPostById(
  id: number | string
): Promise<IJobPostDetailResponse> {
  const response = await API.get(`Requitement/get-by-post/${id}`);
  return response.data;
}


