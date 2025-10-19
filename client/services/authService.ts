import { ISignUp } from "@/types/authTypes"
import { getRequest, postRequest} from "@/utils/request"
export const authService = {
  login: (email: string, password: string) =>postRequest("/auth/login", { email, password }),
  logout: () => postRequest("/auth/logout", {}),
  getUser: () => getRequest("/auth/user"),
  setPassword:(password:string,confirmPassword:string)=>postRequest("/auth/password",{password,confirmPassword})
}