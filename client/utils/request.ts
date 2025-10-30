import axiosInstance from "@/lib/axios"
import type { ApiOptions, ApiResponse } from "@/types/response"
import { defaultOptions } from "@/types/response"

export const postRequest = async <T = any>(
  url: string,
  body: object | FormData,
  options: ApiOptions = defaultOptions
): Promise<ApiResponse<T>> => {
  try {
    const headers: Record<string, string> = {}
    if (!(body instanceof FormData)) headers["Content-Type"] = "application/json"

    const res = await axiosInstance.post(url, body, { headers })
    return res.data
  } catch (error: any) {
    const status = error?.response?.status
    const message =
      error?.response?.data?.msg || error.message || "Request failed"

    return {
      ok: false,
      msg: message,
      data: null as unknown as T,
    }
  }
}

export const getRequest = async <T = any>(
  url: string,
  params?: object,
  options: ApiOptions = defaultOptions
): Promise<ApiResponse<T>> => {
  try {
    const res = await axiosInstance.get(url, params ? { params } : {})
    return res.data
  } catch (error: any) {
    const message =
      error?.response?.data?.msg || error.message || "Request failed"

    return {
      ok: false,
      msg: message,
      data: null as unknown as T,
    }
  }
}
export const putRequest = async <T = any>(
  url: string,
  body: object,
  options: ApiOptions = defaultOptions
): Promise<ApiResponse<T>> => {
  try {
    const res = await axiosInstance.put(url, body)
    return res.data
  } catch (error: any) {
    const message =
      error?.response?.data?.msg || error.message || "Request failed"

    return {
      ok: false,
      msg: message,
      data: null as unknown as T,
    }
  }
}

// 🔹 DELETE request
export const deleteRequest = async <T = any>(
  url: string,
  options: ApiOptions = defaultOptions
): Promise<ApiResponse<T>> => {
  try {
    const res = await axiosInstance.delete(url)
    return res.data
  } catch (error: any) {
    const message =
      error?.response?.data?.msg || error.message || "Request failed"

    return {
      ok: false,
      msg: message,
      data: null as unknown as T,
    }
  }
}
