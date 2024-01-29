<!-- FloatingWidget.vue -->
<template>
	<div
		v-if="isVisible && streams.length > 1"
		class="floating-widget p-2"
		:style="{ top: position.top + 'px', left: position.left + 'px' }"
		@mousedown="startDragging"
	>
		<div v-for="(streamMeta, index) in streams" :key="index">
			<video
				:id="'remoteVideo' + index"
				style="width: auto; height: 150px"
				:srcObject="streamMeta.stream"
				:onClick="() => select(metadata(streamMeta.peer))"
				:style="{
					cursor: streamMeta?.peer !== 'self' ? 'pointer' : 'default',
					backgroundColor: 'black',
				}"
				:muted="streamMeta?.peer == 'self' || streamMeta?.mute"
				v-show="counter % streams.length == index"
				autoplay
				playsinline
			></video>
			<div v-show="counter % streams.length == index">
				{{ metadata(streamMeta.peer)?.nickname || 'Moi' }}
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	data() {
		return {
			isVisible: true,
			isDragging: false,
			counter: 0,
			position: {
				top: 50,
				left: 50,
			},
			dragStart: {
				x: 0,
				y: 0,
			},
		}
	},
	computed: {
		...mapGetters({
			streams: 'peer/getRemoteStreams',
			metadata: 'peer/getUserMetadata',
		}),
	},
	mounted() {
		this.interval = setInterval(() => {
			this.counter++
		}, 5000)
	},
	beforeUnmount() {
		clearInterval(this.interval)
	},
	methods: {
		...mapActions('conversations', ['displayConversation']),

		select(contact) {
			if (!contact || !contact?.id) return
			//if (contact.id == this.user.id) return
			const payload = {
				contact,
				convId: contact.id,
				type: 'conversation',
			}
			this.displayConversation(payload)
		},
		toggleVisibility() {
			this.isVisible = !this.isVisible
		},
		startDragging(event) {
			this.isDragging = true
			this.dragStart.x = event.clientX - this.position.left
			this.dragStart.y = event.clientY - this.position.top

			window.addEventListener('mousemove', this.drag)
			window.addEventListener('mouseup', this.stopDragging)
		},
		drag(event) {
			if (this.isDragging) {
				this.position.left = event.clientX - this.dragStart.x
				this.position.top = event.clientY - this.dragStart.y
			}
		},
		stopDragging() {
			this.isDragging = false
			window.removeEventListener('mousemove', this.drag)
			window.removeEventListener('mouseup', this.stopDragging)
		},
	},
}
</script>

<style scoped>
/* Add your styles for the floating widget */
.floating-widget {
	position: fixed;
	background-color: #000000;
	color: #fff;
	cursor: move;
	border-radius: 5px;
	z-index: 9999;
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}
</style>
