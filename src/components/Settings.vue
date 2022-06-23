<template>
	<div class="row">
		<div class="col-12">
			<h2 class="d-flex justify-content-center">Vos paramètres</h2>
			<h4 class="d-flex justify-content-center">
				Modifiez les paramètres de votre compte
			</h4>
		</div>

		<div v-if="loaded" class="message col-8">
			<div>
				{{ error }}
			</div>
			<div class="d-flex justify-content-center">
				<form @submit="btnSend" class="p-4">
					<label>Pseudo</label>
					<input
						type="text"
						v-model="nickname"
						name="nicknameField"
						id="lnicknameField"
					/><br />
					<label>Message personnalisé</label>
					<input
						type="text"
						v-model="motd"
						name="motdFild"
						id="lmotdField"
					/><br />
					<label>Statut</label>
					<select v-model="status" @change="btnSend">
						<option
							:value="item.id"
							v-for="item in options.status"
							:key="item.id"
						>
							{{ item.name }}
						</option></select
					><br />
					<input type="Submit" class="btn btn-primary" /><br />
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
export default {
	replace: false,
	components: {},
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
