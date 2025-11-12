import API from "..";
import {
  IJobPostResponse,
  IJobPostFilters,
  IRecruitmentMasterData,
  ICreateJobPost,
  IApplicantResponse,
} from "./recruitment-types";

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
        formData.append(key, value.toISOString().split('T')[0]);
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


