export interface ApiOptions {
  showToast?: boolean;
}
export const defaultOptions: ApiOptions = { showToast: true };

export type ApiResponse<T> = {
  ok: boolean;
  msg: string;
  data?: T;
};