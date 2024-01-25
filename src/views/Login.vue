<template>
	<div class="chat">
		<div class="container-fluid">
			<div class="row full-height text-white justify-content-center">
				<div class="message p-5 align-self-center rounded">
					<h5 class="text-danger">{{ error }}</h5>
					<form
						v-show="view == 0"
						@submit.prevent="btnRegister"
						class="d-flex flex-column justify-content-center"
					>
						<h1>S'inscrire</h1>
						<div class="mb-3">
							<label for="rusernameField" class="form-label"
								>Pseudonyme</label
							>
							<input
								type="text"
								v-model="username"
								name="usernameField"
								id="rusernameField"
								class="form-control"
								:disabled="processing"
							/>
						</div>

						<div class="mb-3">
							<label for="rpasswordField" class="form-label"
								>Mot de passe</label
							>
							<input
								type="password"
								v-model="pwd"
								name="rpasswordField"
								id="rpasswordField"
								class="form-control"
								:disabled="processing"
							/>
						</div>

						<button
							type="submit"
							name="submit"
							class="btn btn-primary"
							id="rsubmit"
							:disabled="processing"
						>
							S'inscrire
						</button>
					</form>
					<form
						v-show="view == 1"
						@submit.prevent="btnLogin"
						class="d-flex flex-column justify-content-center"
					>
						<h1>Se connecter</h1>

						<div class="mb-3">
							<label for="lusernameField" class="form-label"
								>Pseudonyme</label
							>
							<input
								type="text"
								v-model="username"
								name="usernameField"
								id="lusernameField"
								class="form-control"
								:disabled="processing"
							/>
						</div>

						<div class="mb-3">
							<label for="lpasswordField" class="form-label"
								>Mot de passe</label
							>
							<input
								type="password"
								v-model="pwd"
								name="passwordField"
								id="lpasswordField"
								class="form-control"
								:disabled="processing"
							/>
						</div>

						<button
							type="submit"
							name="submit"
							class="btn btn-primary"
							:disabled="processing"
						>
							Se connecter
						</button>
					</form>
					<label @click="switchView" class="mt-3 text-primary">{{
						viewText()
					}}</label>
					<div v-show="processing" class="lds-ring">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
				<footer class="col-12 text-white mt-5 message align-self-end">
					<div class="text-center py-5">
						DIX-CORDES {{ new Date().getFullYear() }}
					</div>
				</footer>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	data: function () {
		return {
			username: '',
			pwd: '',
			error: '',
			view: 1,
			processing: false,
		}
	},
	computed: {
		...mapGetters({
			selfToken: 'user/getToken',
		}),
	},
	methods: {
		...mapActions('user', ['register', 'login']),

		async btnLogin(e) {
			e.preventDefault()
			this.processing = true

			const res = await this.login({
				username: this.username,
				password: this.pwd,
			})

			this.processing = false
			if (res.error) return (this.error = res.output)
			this.$router.push('/app')
		},

		async btnRegister(e) {
			e.preventDefault()

			const res = await this.register({
				username: this.username,
				password: this.pwd,
			})

			if (res.error) return (this.error = res.output)
			this.$router.push('/app')
		},

		async switchView() {
			this.view = !this.view
		},

		viewText() {
			if (this.view) {
				return "S'inscrire"
			}
			return 'Se connecter'
		},
	},
	created: async function () {
		if (this.selfToken) {
			return this.$router.push('/app')
		}
	},
}
</script>
