// import axios from "axios";

// class LoginService{
//     static BASE_URL = "http://localhost:8080"

//     static async login(email, password){
//         try{
//             const response = await axios.post(`${LoginService.BASE_URL}/auth/login`, {email, password})
//             console.log(response.data)
//             console.log("hello")
//             return response.data;

//         }catch(err){
//             throw err;
//         }
//     }








 




//     /**AUTHENTICATION CHECKER */
// //     static logout(){
// //         localStorage.removeItem('token')
// //         localStorage.removeItem('role')
// //     }

// //     static isAuthenticated(){
// //         const token = localStorage.getItem('token')
// //         return !!token
// //     }

// //     static isAdmin(){
// //         const role = localStorage.getItem('role')
// //         return role === 'ADMIN'
// //     }

// //     static isUser(){
// //         const role = localStorage.getItem('role')
// //         return role === 'USER'
// //     }

// //     static adminOnly(){
// //         return this.isAuthenticated() && this.isAdmin();
// //     }
//  }

// export default LoginService;