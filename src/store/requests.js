export default {
  namespaced: true,
  state() {
    return {
      requests: [],
    };
  },
  mutations: {
    addRequest(state, payload) {
      state.requests.push(payload);
    },
    setRequests(state, payload) {
      state.requests = payload;
    },
  },
  actions: {
    async contactCoach(context, payload) {
      const newRequest = {
        // coachId: payload.coachId, // no need to send coachId to the newRequest
        userEmail: payload.email,
        message: payload.message,
      };

      // sending to firebase

      const response = await fetch(
        `https://vuex-projects-6691d-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`,
        {
          method: "POST", // POST creates a new request each time
          body: JSON.stringify(newRequest),
        }
      );

      // receiving from firebase
      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(
          responseData.message || "Failed to send request."
        );
        throw error;
      }

      newRequest.id = responseData.name; // adds a new id to the POST and gets back a name field which holds the automatically generated id
      newRequest.coachId = payload.coachId; // payload.coachId is added to the local data but not to the data sent to the server
      context.commit("addRequest", newRequest);
    },

    async fetchRequests(context) {
      const coachId = context.rootGetters.userId;
      const token = context.rootGetters.token;
      const response = await fetch(
        `https://vuex-projects-6691d-default-rtdb.firebaseio.com/requests/${coachId}.json?auth=` +
          token
      );
      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(
          responseData.message || "Failed to fetch requests."
        );
        throw error;
      }

      const requests = [];

      for (const key in responseData) {
        const request = {
          id: key,
          coachId: coachId,
          userEmail: responseData[key].userEmail,
          message: responseData[key].message,
        };
        requests.push(request);
      }

      context.commit("setRequests", requests);
    },
  },
  getters: {
    requests(state, _, _2, rootGetters) {
      const coachId = rootGetters.userId; // rootGetters allow you to access userId that's in the root store
      console.log(state.requests);
      return state.requests.filter((req) => req.coachId === coachId);
    }, // getting the requests for userId c3 if userId is in a separate index file. _ and _2 replace unused arguments getters and rootState.

    requestsReceived(state) {
      return state.requests && state.requests.length > 0;
    },
  },
};
