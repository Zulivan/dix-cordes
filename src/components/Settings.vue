<template>
	<div class="container">
		<div class="row">
			<div class="col-12 text-center mt-4">
				<h2>{{ $t('settings.title') }}</h2>
				<h4>{{ $t('settings.subtitle') }}</h4>
			</div>

			<div v-if="loaded" class="col-8 mx-auto mt-4">
				<div class="message">
					<div>{{ error }}</div>
					<form @submit.prevent="btnSend" class="p-4">
						<div class="mb-3">
							<label for="nicknameField" class="form-label">{{
								$t('settings.nickname')
							}}</label>
							<input
								type="text"
								class="form-control"
								v-model="nickname"
								name="nicknameField"
								id="nicknameField"
							/>
						</div>

						<div class="mb-3">
							<label for="motdField" class="form-label">{{
								$t('settings.motd')
							}}</label>
							<input
								type="text"
								class="form-control"
								v-model="motd"
								name="motdField"
								id="motdField"
							/>
						</div>

						<div class="mb-3">
							<label for="status" class="form-label">{{
								$t('settings.status')
							}}</label>
							<select
								class="form-control form-select"
								v-model="status"
								@change="btnSend"
							>
								<option
									:value="item.id"
									v-for="item in options.status"
									:key="item.id"
								>
									{{ $t('app.status.' + item.name) }}
								</option>
							</select>
						</div>
						{{ $t('settings.language') }}
						<select
							v-model="$root.$i18n.locale"
							class="form-select form-control"
							:on-select="saveLanguage()"
						>
							<option
								v-for="(lang, i) in languages"
								:key="`Lang${i}`"
								:value="lang.id"
							>
								{{ lang.name }}
							</option>
						</select>
						<button type="submit" class="btn btn-success mt-3">
							{{ $t('app.edit') }}
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
			languages: [
				{ id: 'de', name: 'Deutsch' },
				{ id: 'en', name: 'English' },
				{ id: 'es', name: 'Español' },
				{ id: 'fr', name: 'Français' },
				{ id: 'pr', name: 'Pirate' },
				{ id: 'tw', name: '繁體中文' },
				{ id: 'zh', name: '简体中文' },
				{ id: 'jp', name: '日本語' },
			],
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

		saveLanguage() {
			localStorage.setItem('locale', this.$root.$i18n.locale)
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
