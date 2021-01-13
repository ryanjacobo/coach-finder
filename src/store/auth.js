let timer;
export default {
  //   namespaced: true, // must not be namespaced
  state() {
    return {
      userId: null, // used as the ID of the current (logged in) user
      token: null,
      // tokenExpiration: null,
      didAutoLogout: true,
    };
  },
  actions: {
    async auth(context, payload) {
      const mode = payload.mode; // mode references signup or login
      let url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCLw2HZiWeAY-AwPWNDi24sVCBPylHs4eA"; // login URL

      if (mode === "signup") {
        url =
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCLw2HZiWeAY-AwPWNDi24sVCBPylHs4eA"; // signup URL
      }
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }), // async - await replaces '.then' as the promise for a fetch
      });
      const responseData = await response.json();

      if (!response.ok) {
        console.log(responseData);
        const error = new Error(
          responseData.message || "Failed to authenticate."
        );
        throw error;
      }

      const expiresIn = +responseData.expiresIn * 1000; // "+" converts responseData.expiresIn to a number
      // const expiresIn = 5000; // "+" converts responseData.expiresIn is converted to a number
      const expirationDate = new Date().getTime() + expiresIn;

      // save the token and userId to browser to stay logged in despite browser refresh
      localStorage.setItem("token", responseData.idToken);
      localStorage.setItem("userId", responseData.localId);
      localStorage.setItem("tokenExpiration", expirationDate); // stores an expiration date on the token

      timer = setTimeout(function() {
        context.dispatch("autoLogout");
      }, expiresIn);

      console.log(localStorage);

      context.commit("setUser", {
        token: responseData.idToken,
        userId: responseData.localId,
        // tokenExpiration: expirationDate // doesn't need to be committed as it get stored automatically to the localStorage
      });
    },

    // save the token and userId to browser to stay logged in despite browser refresh
    tryLogin(context) {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const tokenExpiration = localStorage.getItem("tokenExpiration");

      const expiresIn = +tokenExpiration - new Date().getTime();

      if (expiresIn < 0) {
        return;
      }

      timer = setTimeout(function() {
        context.dispatch("autoLogout");
      }, expiresIn);

      // keeps user logged in
      if (token && userId) {
        context.commit("setUser", {
          token: token,
          userId: userId,
          // tokenExpiration: null,
        });
      }
    },
    async signup(context, payload) {
      return context.dispatch("auth", {
        ...payload,
        mode: "signup",
      }); // '...payload' spreads the properties:values in the argument
    },
    async login(context, payload) {
      return context.dispatch("auth", {
        ...payload,
        mode: "login",
      });
    },
    logout(context) {
      // Auto Logout Step 1
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("tokenExpiration"); // tokenExpiration - token expires in 3600 secs (1 hour)

      clearTimeout(timer);

      context.commit("setUser", {
        token: null,
        userId: null,
        // tokenExpiration: null,
      });
    },
    autoLogout(context) {
      context.dispatch("logout");
      context.commit("setAutoLogout");
    },
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      // state.tokenExpiration = payload.tokenExpiration; // expiration date has been set automatically in the auth so no need to include in setUser
      state.didAutoLogout = false;
    },
    setAutoLogout(state) {
      state.didAutoLogout = true;
    },
  },
  getters: {
    userId(state) {
      return state.userId;
    },
    token(state) {
      return state.token;
    },
    isAuthenticated(state) {
      return !!state.token; // '!!' converts state.token to a 'true' boolean
    },
    setAutoLogout(state) {
      state.didAutoLogout = true;
    },
    didAutoLogout(state) {
      return state.didAutoLogout;
    },
  },
};
