import { deleteRequest, getRequest, postRequest, putRequest } from "@/utils/request";

export const subjectServices = {
    addSubject: (title: string, description: string) => postRequest("/subject", { title, description }),
    getSubjects: (params?: {
    search?: string
    sortBy?: "name" | "date" | "chapters"
    page?: number
    limit?: number
  }) => getRequest("/subject", params),
  editSubject: (id: string, title: string, description: string) =>putRequest(`/subject/${id}`, { title, description }),
  deleteSubject: (id: string) =>deleteRequest(`/subject/${id}`),
}