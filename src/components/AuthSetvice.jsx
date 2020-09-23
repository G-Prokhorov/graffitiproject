import axios from "axios";

const API_URL = "http://localhost:8080/api/";

class AuthService {
  async login(data) {
   try { 
        let response = await axios.post(API_URL + "login", {data})
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
          console.log(response.data.token)
          return true
        }
      } catch (err) {
        console.log(err)
        return false
        
      }
  }

  logout() {
    localStorage.removeItem("user");
  }

  async register(data) {
    try {
      let res = await axios.post(API_URL + "register", {data}); 
      return res.status
    } catch (err) {
      console.log("Error while register user");
      return 500
    }
  }

  async CheckToken() {
     let token = JSON.parse(localStorage.getItem('user'));
    try {let res = await axios.post(API_URL + "checkToken", token);
      return (res.status)
    } catch(err) {
      return 500
      }
  }
}

export default new AuthService();
