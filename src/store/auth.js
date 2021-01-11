let timer;
export default {
  //   namespaced: true, // must not be namespaced
  state() {
    return {
      userId: null, // used as the ID of the current (logged in) user
      token: null,
      tokenExpiration: null,
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
        }), // async - await replaces .then as the promise for a fetch
      });
      const responseData = await response.json();

      if (!response.ok) {
        console.log(responseData);
        const error = new Error(
          responseData.message || "Failed to authenticate."
        );
        throw error;
      }

      const expiresIn = +responseData.expiresIn * 1000;
      const expirationDate = new Date().getTime() + expiresIn;

      // save the token and userId to browser to stay logged in despite browser refresh
      localStorage.setItem("token", responseData.idToken);
      localStorage.setItem("userId", responseData.localId);
      localStorage.setItem("tokenExpiration", expirationDate); // stores an expiration date on the token

      timer = setTimeout(function() {
        context.dispatch("logout");
      }, expiresIn);

      console.log(responseData);
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
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      // state.tokenExpiration = payload.tokenExpiration; // expiration date has been set automatically in the auth so no need to include in setUser
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
  },
};
