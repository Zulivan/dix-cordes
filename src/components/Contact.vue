<template>
	<div
		:id="contact.id"
		class="p-1 col-12"
		:class="{ chat: selected }"
		style="height: 75px"
		@mouseover="hover = true"
		@mouseleave="hover = false"
	>
		<div class="m-1 message-img" @click="this.$emit('selectContact')">
			<img
				class="img-fluid rounded-circle"
				:src="
					require(
						'@/assets/images/' + (contact?.image || 'unknown.png')
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
		<div @click="this.$emit('selectContact')">
			<div class="d-flex">
				<h4
					style="
						display: inline;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					"
				>
					{{ contact?.nickname }}
				</h4>
			</div>
			<div class="d-flex">
				<div class="mr-1">
					<div
						v-if="contact?.status_object"
						class="statusTab mr-1"
						:style="{
							'background-color': contact?.status_object?.color,
						}"
					></div>
				</div>
				<span
					style="
						display: inline;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					"
				>
					{{ contact?.motd || contact?.status_object?.name }}
				</span>
			</div>
			<button
				class="btn btn-danger"
				v-if="trigger && hover"
				style="position: relative; bottom: 50px; left: -50px"
				@click="trigger.func(contact)"
			>
				{{ trigger.icon }}
			</button>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { useSound } from '@vueuse/sound'
import notifSound from '../assets/audio/app/notification.mp3'

export default {
	props: ['contact', 'trigger', 'fullMotd', 'selected'],
	emits: ['selectContact'],
	data: function () {
		return {
			hover: false,
		}
	},
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
