import { MESSAGES } from "../const/messages";
import { ISubject } from "../types/subjectTypes";
import { throwError } from "../utils/response";


export const validateAddSubject = (title:string,description:string): void => {
  if (!title && !description) throwError(MESSAGES.SUBJECT.MISSING_FIELDS);
  if (!title) throwError(MESSAGES.SUBJECT.TITLE_REQUIRED);
  if (title.length < 3) throwError(MESSAGES.SUBJECT.TITLE_TOO_SHORT);
  if (title.length > 100) throwError(MESSAGES.SUBJECT.TITLE_TOO_LONG);
  if (description && description.length > 500) {
    throwError(MESSAGES.SUBJECT.DESCRIPTION_TOO_LONG);
  }
};
