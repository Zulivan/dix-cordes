<template>
	<div
		class="rounded message d-flex mx-2"
		@mouseover="hover = true"
		@mouseleave="hover = false"
		v-bind:class="{
			'flex-row-reverse text-right': isSender(),
			'pt-2 pb-1': this.view == 'full',
		}"
	>
		<img
			v-show="this.view == 'full'"
			class="img-fluid rounded-circle message-img mx-3"
			:src="
				require(
					'@/assets/images/' +
						(message.sender_user.image || 'unknown.png')
				)
			"
		/>
		<code
			v-show="this.view == 'light'"
			class="pr-4"
			v-bind:class="{
				'message-invis': !this.hover,
			}"
			>{{
				new Date(message.date).toLocaleTimeString('en-GB', {
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
				})
			}}</code
		>
		<div class="d-flex flex-column content">
			<div
				v-show="this.view == 'full'"
				class="d-flex align-middle"
				v-bind:class="{
					'flex-row-reverse': isSender(),
				}"
			>
				<h5>{{ message.sender_user.nickname }}</h5>
				<span class="px-1"></span>
				<code>{{
					new Date(message.date).toLocaleTimeString('en-GB', {
						hour: '2-digit',
						minute: '2-digit',
						second: '2-digit',
					})
				}}</code>
			</div>
			<div
				v-if="isSender() && conversation.type == 'conversation'"
				style="position: relative"
			>
				<div
					@mouseover="hoverDelete = true"
					@mouseleave="hoverDelete = false"
					v-show="hover"
					class="messageEditor d-flex justify-content-end"
					@click="deleteMessage(this.message.id)"
				>
					<button class="btn btn-danger">
						{{ hoverDelete ? 'Supprimer' : 'X' }}
					</button>
				</div>
			</div>
			<div>
				{{ message.content }}
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	props: ['message', 'view'],
	data: function () {
		return {
			hover: false,
			hoverDelete: false,
		}
	},
	computed: {
		...mapGetters({
			user: 'user/getInfo',

			conversation: 'conversations/getConversation',
		}),
	},
	methods: {
		...mapActions('conversations', ['deleteMessage']),
		isSender() {
			return this.user.id == this.message.sender_user.id
		},
	},
	created: function () {},
}
</script>
