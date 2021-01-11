<template>
  <div>
    <base-dialog :show="!!error" title="An error occured!" @close="handleError">
      <!--"!!" converts a truthy value into a real boolean-->
      <p>{{error}}</p>
    </base-dialog>
    <section>
      <coach-filter @change-filter="setFilters"></coach-filter>
    </section>
    <base-card>
      <section>
        <div class="controls">
          <base-button mode="outline" @click="loadCoaches(true)">Refresh</base-button>
          <base-button
            link
            to="/auth?redirect=register"
            v-if="!isLoggedIn"
          >Login to Register as Coach</base-button>
          <base-button
            v-if="!isCoach && !isLoading && isLoggedIn"
            link
            to="/register"
          >Register as Coach</base-button>
          <!--user needs to be logged in to register as coach-->
        </div>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if="coachesAvailable">
          <!--Parent(CoachesList) - Child(CoachData)-->
          <coach-data
            v-for="coach in filteredCoaches"
            :key="coach.id"
            :id="coach.id"
            :first-name="coach.firstName"
            :last-name="coach.lastName"
            :rate="coach.hourlyRate"
            :areas="coach.areas"
          ></coach-data>
        </ul>
        <h3 v-else>No coaches available at the moment.</h3>
      </section>
    </base-card>
  </div>
</template>

<script>
import CoachData from "./CoachData";
import CoachFilter from "./CoachFilter";
import BaseSpinner from "../components/ui/BaseSpinner";
import BaseDialog from "../components/ui/BaseDialog";

export default {
  components: { CoachData, CoachFilter, BaseSpinner, BaseDialog },
  data() {
    return {
      isLoading: false,
      activeFilters: {
        frontend: true,
        backend: true,
        career: true
      },
      error: null
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    // directly retrieved from store (getters)
    isCoach() {
      return this.$store.getters["coaches/isCoach"];
    },
    filteredCoaches() {
      const coaches = this.$store.getters["coaches/coaches"];
      return coaches.filter(coach => {
        if (this.activeFilters.frontend && coach.areas.includes("frontend")) {
          return true;
        }
        if (this.activeFilters.backend && coach.areas.includes("backend")) {
          return true;
        }
        if (this.activeFilters.career && coach.areas.includes("career")) {
          return true;
        }
        return false;
      });
    },
    coachesAvailable() {
      return !this.isLoading && this.$store.getters["coaches/coachesAvailable"];
    }
  },
  methods: {
    setFilters(updatedFilters) {
      this.activeFilters = updatedFilters;
    },
    async loadCoaches(refresh = false) {
      this.isLoading = true;
      try {
        await this.$store.dispatch("coaches/loadCoaches", {
          forceRefresh: refresh
        });
      } catch (error) {
        this.error = error.message || "Something went wrong";
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    }
  },
  // created takes place when CoachList component is loaded
  created() {
    this.loadCoaches(); // retrieved from loadCoaches methods
  }
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
