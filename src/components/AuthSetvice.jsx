import axios from "axios";

const API_URL = "http://localhost:8080/api/";

class AuthService {
  async login(data) {
    try {
      console.log(data)
      let response = await axios.post(API_URL + "login", { data })
      if (response.data.token && response.data.refreshToken) {
        localStorage.setItem("user", JSON.stringify(response.data.token));
        localStorage.setItem("refresh", JSON.stringify(response.data.refreshToken));
        console.log(response)
        return true
      }
    } catch (err) {
      console.log(err)
      return false

    }
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("refresh");
  }

  async register(data) {
    try {
      let res = await axios.post(API_URL + "register", { data });
      return res.status
    } catch (err) {
      console.log("Error while register user");
      return 500
    }
  }

  async CheckToken() {
    let token = JSON.parse(localStorage.getItem('user'));
    let refreshToken = JSON.parse(localStorage.getItem('refresh'));
    try {
      let res = await axios.post(API_URL + "checkToken",
        {
          token: token,
          refreshToken: refreshToken
        });

      this.saveNewToken(res);

      return (res.status);


    } catch (err) {
      this.logout();
      console.log(err)
      return 500
    }
  }

  async saveNewToken(res) {
    try {
      if (res.data.token && res.data.refreshToken) {
        console.log("here")
        await localStorage.setItem("user", JSON.stringify(res.data.token)); // не работает
        await localStorage.setItem("refresh", JSON.stringify(res.data.refreshToken));
      } else {
        if (res.status != 200) {
          this.logout();
        }
        return (res.status);
      }

    } catch (err) {
      this.logout();
      console.log(err)
      return 500
    }
  }

}



export default new AuthService();
