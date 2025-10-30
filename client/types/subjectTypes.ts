export interface ISubject {
  subId: string;
  title: string;
  description: string;
  date: string;
}

export interface SubjectState {
  subjects: ISubject[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}
export interface FetchSubjectsResponse {
  subjects: ISubject[];
  total: number;
  page: number;
  totalPages: number;
}

