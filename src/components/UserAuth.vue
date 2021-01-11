<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <!--!! turns the value of the property to a boolean-->
      <p>{{error}}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Authenticating..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <label for="email">Email</label>
          <input type="email" id="email" v-model.trim="email" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" v-model.trim="password" />
        </div>
        <p
          v-if="!formIsValid"
        >Please enter a valid email and password (must be at least 6 characters long).</p>
        <base-button>{{submitButtonCaption}}</base-button>
        <base-button type="button" mode="flat" @click="switchAuthMode">{{switchModeButtonCaption}}</base-button>
      </form>
    </base-card>
  </div>
</template>

<script>
import BaseCard from "./ui/BaseCard";
import BaseDialog from "./ui/BaseDialog";
import BaseSpinner from "./ui/BaseSpinner";
export default {
  components: { BaseCard, BaseDialog, BaseSpinner },
  data() {
    return {
      email: "",
      password: "",
      formIsValid: true,
      mode: "login",
      isLoading: false,
      error: null
    };
  },
  methods: {
    async submitForm() {
      if (
        this.email === "" ||
        !this.email.includes("@") ||
        this.password.length < 6
      ) {
        this.formIsValid = false;
        return;
      }

      this.isLoading = true;

      try {
        if (this.mode === "login") {
          await this.$store.dispatch("login", {
            email: this.email,
            password: this.password
          });
        } else {
          await this.$store.dispatch("signup", {
            email: this.email,
            password: this.password
          });
        }
        const redirectUrl = "/" + (this.$route.query.redirect || "coaches"); // redirect to 'coaches' if URL has no query parameter (?redirect=register)
        this.$router.replace(redirectUrl); // directs to CoachesList after successful login
      } catch (err) {
        // this.error = err.message || "Failed to authenticate, try later.";
        this.error = "Signup failed. Check credentials.";
      }
      this.isLoading = false;
    },
    switchAuthMode() {
      if (this.mode === "login") {
        this.mode = "signup";
      } else {
        this.mode = "login";
      }
    },
    handleError() {
      this.error = null;
    }
  },
  computed: {
    submitButtonCaption() {
      if (this.mode === "login") {
        return "Login";
      } else {
        return "Signup";
      }
    },
    switchModeButtonCaption() {
      if (this.mode === "login") {
        return "Signup instead";
      } else {
        return "Login instead";
      }
    }
  }
};
</script>

<style scoped>
form {
  margin: 1rem;

  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>