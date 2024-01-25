<template>
	<div
		:id="contact.id"
		class="p-1 d-flex align-items-center col-12"
		:class="{ chat: selected }"
		style="height: 75px"
	>
		<div class="m-1 message-img" @click="this.$emit('selectContact')">
			<img
				class="img-fluid rounded-circle"
				:src="
					require(
						'@/assets/images/' + (contact.image || 'unknown.png')
					)
				"
			/>
			<div
				v-if="unreads > 0"
				class="cercle d-flex align-items-center justify-content-center"
			>
				<b>{{ unreads }}</b>
			</div>
		</div>
		<div
			class="px-2 display-flex flex-direction-column"
			style="flex-grow: 1"
			@click="this.$emit('selectContact')"
		>
			<h4>{{ contact.nickname }}</h4>
			<div class="d-flex">
				<div
					v-if="contact.status_object"
					class="statusTab mr-1"
					:style="{ 'background-color': contact.status_object.color }"
				></div>
				<h6>
					{{
						(contact.motd &&
						contact.motd.length > 26 &&
						!this.fullMotd
							? contact.motd.slice(0, 26) + '...'
							: contact.motd) || contact.status_object.name
					}}
				</h6>
			</div>
		</div>
		<button
			class="btn btn-dark"
			v-if="trigger"
			@click="trigger.func(contact)"
		>
			{{ trigger.icon }}
		</button>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { useSound } from '@vueuse/sound'
import notifSound from '../assets/audio/app/notification.mp3'

export default {
	props: ['contact', 'trigger', 'fullMotd', 'selected'],
	emits: ['selectContact'],
	computed: {
		...mapGetters({
			convUnreads: 'conversations/getUnreads',
		}),
		unreads: function () {
			if (this.contact?.ignoreUnreads) {
				return 0
			}
			return this.convUnreads(this.contact.id)
		},
	},
	setup() {
		const { play } = useSound(notifSound)

		return {
			play,
		}
	},
	watch: {
		unreads: function (v) {
			if (v > 0) this.play()
		},
	},
}
</script>
