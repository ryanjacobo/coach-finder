export default {
  namespaced: true,
  state() {
    return {
      // userId: "c3",
      lastFetch: null,
      coaches: [
        {
          id: "c1",
          firstName: "Maximilian",
          lastName: "Schwarzmüller",
          areas: ["frontend", "career"],
          description:
            "I'm Maximilian and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
          hourlyRate: 30,
        },
        {
          id: "c2",
          firstName: "Julie",
          lastName: "Jones",
          areas: ["backend", "career"],
          description:
            "I am Julie and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.",
          hourlyRate: 30,
        },
      ],
    };
  },
  actions: {
    async registerCoach(context, data) {
      const userId = context.rootGetters.userId;
      const coachData = {
        id: context.rootGetters.userID,
        firstName: data.first,
        lastName: data.last,
        description: data.desc,
        hourlyRate: data.rate,
        areas: data.areas,
      }; // passes the data to mutations

      const token = context.rootGetters.token;

      const response = await fetch(
        `https://vuex-projects-6691d-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=` +
          token,
        {
          method: "POST", // "PUT" only overwrites the coach that is already registered in the db
          body: JSON.stringify(coachData),
        }
      );

      // firestore
      // const response = await projectFirestore
      //   .collection("coaches")
      //   .add(coachData);

      const responseData = await response.json();
      if (!response.ok) {
        // error
        console.log(responseData);
        const error = new Error(responseData.message || "Missing token.");
        throw error;
      }

      context.commit("registerCoachMutations", coachData);
    },
    async loadCoaches(context, payload) {
      if (!payload.forceRefresh && !context.getters.shouldUpdate) {
        return;
      }
      const response = await fetch(
        `https://vuex-projects-6691d-default-rtdb.firebaseio.com/coaches.json`
      );

      const responseData = await response.json();

      // const response = await projectFirestore.collection("coaches").get();
      // console.log(response.doc);

      // const responseData = await response.doc;

      if (!response.ok) {
        const error = new Error(responseData.message || "Failed to fetch!");
        throw error;
      }
      const coaches = [];
      for (const key in responseData) {
        const coach = {
          id: key,
          firstName: responseData[key].firstName,
          lastName: responseData[key].lastName,
          description: responseData[key].description,
          hourlyRate: responseData[key].hourlyRate,
          areas: responseData[key].areas,
        };
        coaches.push(coach);
      }
      context.commit("setCoaches", coaches);
      context.commit("setFetchTimestamp");
    },
  },
  mutations: {
    registerCoachMutations(state, payload) {
      state.coaches.push(payload);
    },
    setCoaches(state, payload) {
      state.coaches = payload;
    },
    setFetchTimestamp(state) {
      state.lastFetch = new Date().getTime();
    },
  },

  getters: {
    coaches(state) {
      return state.coaches;
    },
    coachesAvailable(state) {
      return state.coaches && state.coaches.length > 0;
    },
    isCoach(_, getters, _2, rootGetters) {
      const coaches = getters.coaches;
      const userId = rootGetters.userId;
      return coaches.some((coach) => coach.id === userId);
    }, //_ and _2 replace unused arguments state and rootState.
    shouldUpdate(state) {
      const lastFetch = state.lastFetch;
      if (!lastFetch) {
        return true;
      }
      const currentTimeStamp = new Date().getTime();
      return (currentTimeStamp - lastFetch) / 1000 > 60;
    },
  },
};
