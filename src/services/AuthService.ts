import { axiosFetch } from "@configs/axios";
import { loginRequest } from "@declared-types/index";

class AuthService {
  async login(payload: loginRequest) {
    return axiosFetch.post("/auth/login", payload).then((res) => res.data);
  }
}
export default new AuthService();
