import { postRequest } from "@/utils/request";

export const subjectServices = {
    addSubject:(title:string,description:string)=>postRequest("/subject",{title,description})
}