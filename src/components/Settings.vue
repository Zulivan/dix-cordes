<template>
	<div class="container">
		<div class="row">
			<div class="col-12 text-center mt-4">
				<h2>Vos paramètres</h2>
				<h4>Modifiez les paramètres de votre compte</h4>
			</div>

			<div v-if="loaded" class="col-8 mx-auto mt-4">
				<div class="message">
					<div>{{ error }}</div>
					<form @submit.prevent="btnSend" class="p-4">
						<div class="mb-3">
							<label for="nicknameField" class="form-label"
								>Pseudo</label
							>
							<input
								type="text"
								class="form-control"
								v-model="nickname"
								name="nicknameField"
								id="nicknameField"
							/>
						</div>

						<div class="mb-3">
							<label for="motdField" class="form-label"
								>Message personnalisé</label
							>
							<input
								type="text"
								class="form-control"
								v-model="motd"
								name="motdField"
								id="motdField"
							/>
						</div>

						<div class="mb-3">
							<label for="status" class="form-label"
								>Statut</label
							>
							<select
								class="form-select"
								v-model="status"
								@change="btnSend"
							>
								<option
									:value="item.id"
									v-for="item in options.status"
									:key="item.id"
								>
									{{ item.name }}
								</option>
							</select>
						</div>

						<button type="submit" class="btn btn-success">
							Modifier
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
export default {
	data() {
		return {
			loaded: false,
			options: {},
			status: '',
			nickname: '',
			motd: '',
			error: '',
		}
	},
	computed: {
		...mapGetters({
			contacts: 'contacts/getContacts',
			userInfo: 'user/getInfo',
		}),
	},
	methods: {
		...mapActions('user', ['updateInfo']),

		async btnSend(e) {
			e.preventDefault()

			const res = await this.updateInfo({
				nickname: this.nickname,
				motd: this.motd,
				status: this.status,
			})

			if (res.error) return (this.error = res.output)
		},

		async retrieveSettings() {
			const url = '/user/getSettings/'
			const res = await axios.get(url)
			return res.data.output
		},
	},
	created: async function () {
		this.nickname = this.userInfo.nickname
		this.status = this.userInfo.status
		this.motd = this.userInfo.motd

		this.options = await this.retrieveSettings()

		this.loaded = true
	},
}
</script>
