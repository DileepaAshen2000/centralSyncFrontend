import axios from "axios";

class LoginService {
  static BASE_URL = "http://localhost:8080";

  static async login(email, password) {
    try {
      const response = await axios.post(
        `${LoginService.BASE_URL}/user/auth/login`,
        { email, password }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("email", email);
      localStorage.setItem("workSite", response.data.workSite);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static getAuthToken() {
    return localStorage.getItem("token");
  }
  static getUserId() {
    return localStorage.getItem("userId");
  }

  static getEmail() {
    return localStorage.getItem("email");
  }
  static getAuthToken() {
    return localStorage.getItem("token");
  }

  // static async register (userData, token){
  //     try{
  //         const response = await axios.post(`${LoginService.BASE_URL}/user/add`, userData,
  //         {
  //             headers: {Authorization: `Bearer${token}`}
  //         })
  //         return response.data;
  //     }
  //     catch(err){
  //         throw err;
  //     }
  // }

  // static async getAllUsers (token){
  //     try{
  //         const response = await axios.get(`${LoginService.BASE_URL}/user/getAll`,
  //         {
  //             headers: {Authorization: `Bearer ${token}`}
  //         })
  //         return response.data;
  //     }
  //     catch(err){
  //         throw err;
  //     }
  // }

  static async getYourProfile(token) {
    try {
      const response = await axios.get(
        `${LoginService.BASE_URL}/user/get-profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  // static async getUserById (userId , token){
  //     try{
  //         const response = await axios.get(`${LoginService.BASE_URL}/user/users/${userId}`, // add actual api-endpoint
  //         {
  //             headers: {Authorization: `Bearer ${token}`}
  //         })
  //         return response.data;
  //     }
  //     catch(err){
  //         throw err;
  //     }
  // }

  // static async deleteUser (userId , token){
  //     try{
  //         const response = await axios.delete(`${LoginService.BASE_URL}/user/delete/${userId}`, // add actual api-endpoint
  //         {
  //             headers: {Authorization: `Bearer ${token}`}
  //         })
  //         return response.data;
  //     }
  //     catch(err){
  //         throw err;
  //     }
  // }

  // static async updateUser (userId , userData, token){
  //     try{
  //         const response = await axios.delete(`${LoginService.BASE_URL}/user/update/${userId}`, userData, // add actual api-endpoint
  //         {
  //             headers: {Authorization: `Bearer ${token}`}
  //         })
  //         return response.data;
  //     }
  //     catch(err){
  //         throw err;
  //     }
  // }

  /**AUTHENTICATION CHECKER */

  static async logout() {
    const token = LoginService.getAuthToken();
    const email = LoginService.getEmail();
    if (!token || !email) {
      throw new Error("User is not logged in.");
    }

    try {
      const response = await axios.post(
        `${LoginService.BASE_URL}/user/auth/logout`,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("workSite");
      }
      return response.data;
    } catch (err) {
      console.error("Logout failed:", err);
      throw err;
    }
  }

  static isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token;
  }

  static isReqHandler() {
    const role = localStorage.getItem("role");
    return role === "REQUEST_HANDLER";
  }

  static isAdmin() {
    const role = localStorage.getItem("role");
    return role === "ADMIN";
  }

  static isEmployee() {
    const role = localStorage.getItem("role");
    return role === "EMPLOYEE";
  }

  static returnUserID() {
    const userId = localStorage.getItem("userId");
    return userId;
  }

  static isOnlineEmployee() {
    const workSite = localStorage.getItem("workSite");
    return workSite === "ONLINE";
  }

  static reqHandlerOnly() {
    return this.isAuthenticated() && this.isReqHandler();
  }
}

export default LoginService;
