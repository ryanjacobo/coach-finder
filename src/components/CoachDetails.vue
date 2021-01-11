<template>
  <div>
    <section>
      <base-card>
        <h2>{{ fullName }}</h2>
        <h3>${{rate}}/hour</h3>
        <!-- </base-card>
        <base-card>-->
        <base-badge v-for="area in areas" :key="area" :type="area" :title="area"></base-badge>
        <p>{{ description }}</p>
        <!-- <base-button link :to="contactLink">Contact</base-button> -->
      </base-card>
    </section>

    <section>
      <base-card>
        <header>
          <h2>Contact Coach</h2>
          <base-button link :to="contactLink">Contact</base-button>
        </header>
        <router-view></router-view>
      </base-card>
    </section>
  </div>
</template>

<script>
export default {
  props: ["id"], // from index.js, props: true.
  data() {
    return {
      selectedCoach: null
    };
  },
  computed: {
    fullName() {
      return this.selectedCoach.firstName + " " + this.selectedCoach.lastName;
    },
    areas() {
      return this.selectedCoach.areas;
    },
    rate() {
      return this.selectedCoach.hourlyRate;
    },
    description() {
      return this.selectedCoach.description;
    },
    contactLink() {
      return this.$route.path + "/" + this.id + "/contact";
    }
  },
  // created lifecycle hook. sets the data to the data from the store.
  created() {
    this.selectedCoach = this.$store.getters["coaches/coaches"].find(
      coach => coach.id === this.id
    );
  }
};
</script>

<style scoped>
li {
  margin: 1rem 0;
  border: 1px solid #424242;
  border-radius: 12px;
  padding: 1rem;
}

h3 {
  font-size: 1.5rem;
}

h3,
h4 {
  margin: 0.5rem 0;
}

div {
  margin: 0.5rem 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>