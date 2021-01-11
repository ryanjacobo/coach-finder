<template>
  <section>
    <base-card>
      <h2>Register as a Coach now!</h2>
      <CoachRegForm @save-data="saveData" />
      <!--Parent(CoachRegistration) - Child(CoachRegistration) -->
    </base-card>
  </section>
</template>

<script>
import CoachRegForm from "./CoachRegForm";
export default {
  components: { CoachRegForm },
  data() {
    return {};
  },

  methods: {
    saveData(data) {
      this.$store.dispatch("coaches/registerCoach", data);
      this.$router.replace("/coaches"); // replace is same a push except you can't go back to previous page with replace
    }
  }
};
</script>

<style>
</style>