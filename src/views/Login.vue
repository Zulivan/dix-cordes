<template>
	<div class="chat">
		<div class="container-fluid">
			<div class="row full-height text-white justify-content-center">
				<div class="message p-5 align-self-center rounded">
					<h5 class="text-danger">
						{{ error && $t('app.auth.errors.' + error) }}
					</h5>
					<form
						v-show="view == 0"
						@submit.prevent="btnRegister"
						class="d-flex flex-column justify-content-center"
					>
						<h1>{{ $t('app.register') }}</h1>
						<div class="mb-3">
							<label for="rusernameField" class="form-label">{{
								$t('settings.nickname')
							}}</label>
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
							<label for="rpasswordField" class="form-label">{{
								$t('settings.password')
							}}</label>
							<input
								type="password"
								v-model="pwd"
								name="rpasswordField"
								id="rpasswordField"
								class="form-control"
								:disabled="processing"
							/>
						</div>
						<div class="mb-3">
							<label
								for="rpasswordConfirmField"
								class="form-label"
								>{{
									$t('settings.passwordConfirmation')
								}}</label
							>
							<input
								type="password"
								v-model="pwdConfirm"
								name="rpasswordConfirmField"
								id="rpasswordConfirmField"
								class="form-control"
								:disabled="processing"
							/>
							<div v-show="pwdCriteria.length > 0" class="mt-2">
								{{ $t('app.auth.passwordCriteria.title') }}
								<ul>
									<li v-for="item in pwdCriteria" :key="item">
										{{
											$t(
												'app.auth.passwordCriteria.' +
													item
											)
										}}
									</li>
								</ul>
							</div>
						</div>
						<button
							type="submit"
							name="submit"
							class="btn btn-primary"
							id="rsubmit"
							:disabled="processing"
						>
							{{ $t('app.register') }}
						</button>
					</form>
					<form
						v-show="view == 1"
						@submit.prevent="btnLogin"
						class="d-flex flex-column justify-content-center"
					>
						<h1>{{ $t('app.login') }}</h1>
						<div class="mb-3">
							<label for="lusernameField" class="form-label">{{
								$t('settings.nickname')
							}}</label>
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
							<label for="lpasswordField" class="form-label">{{
								$t('settings.password')
							}}</label>
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
							{{ $t('app.login') }}
						</button>
					</form>
					<label @click="switchView" class="mt-3 text-primary">{{
						this.view == 0 ? $t('app.login') : $t('app.register')
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
						<span>DIX-CORDES {{ new Date().getFullYear() }} -</span>
						<a href="https://github.com/Zulivan/dix-cordes"
							><i class="fab fa-github"></i>
							{{ $t('app.sourceCode') }}</a
						>
					</div>
				</footer>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	data() {
		return {
			username: '',
			pwd: '',
			pwdConfirm: '',
			pwdCriteria: [],
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
			if (res.error) this.error = res.output
			else this.$router.push('/app')
		},

		async checkPassword(password) {
			let strengthCriteria = [
				{ regex: /[a-z]+/, message: 'lowercase' },
				{ regex: /[A-Z]+/, message: 'uppercase' },
				{ regex: /[0-9]+/, message: 'number' },
				{ regex: /[^a-zA-Z0-9]+/, message: 'special' },
				{ regex: /.{8,}/, message: 'length' },
			]

			let missingCriteria = []
			let strength = 0
			for (let i = 0; i < strengthCriteria.length; i++) {
				if (strengthCriteria[i].regex.test(password)) {
					strength++
				} else {
					missingCriteria.push(strengthCriteria[i].message)
				}
			}

			return { strong: strength >= 5, missingCriteria }
		},

		async btnRegister(e) {
			e.preventDefault()

			if (this.username.length < 3) {
				this.error = 'usernameTooShort'
				return
			}

			if (this.pwd !== this.pwdConfirm) {
				this.error = 'passwordsDontMatch'
				return
			}

			const passwordStrength = await this.checkPassword(this.pwd)

			if (!passwordStrength.strong) {
				this.error = 'passwordTooWeak'
				this.pwdCriteria = passwordStrength.missingCriteria
				return
			}

			this.processing = true
			const res = await this.register({
				username: this.username,
				password: this.pwd,
			})
			this.processing = false

			if (res.error) this.error = res.output
			else this.$router.push('/app')
		},
		switchView() {
			this.view = !this.view
		},
	},
	created() {
		if (this.selfToken) this.$router.push('/app')
	},
}
</script>
