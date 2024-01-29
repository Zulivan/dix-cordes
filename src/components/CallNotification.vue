<template>
	<div
		:class="callStack > 0 ? 'modal' : 'modal fade'"
		:style="{ display: callStack > 0 ? 'block' : 'none' }"
		tabindex="-1"
	>
		<div class="modal-dialog text-black" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="incomingCallModalLabel">
						Appel de {{ username }}
					</h5>
					<button
						type="button"
						class="close"
						data-dismiss="modal"
						aria-label="Close"
					>
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<p>{{ username }} souhaite vous appeler...</p>
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-success"
						@click="() => answerCall()"
					>
						Répondre
					</button>
					<button
						type="button"
						class="btn btn-danger"
						data-dismiss="modal"
						@click="() => rejectCall()"
					>
						Décliner
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { useSound } from '@vueuse/sound'
import ringtoneSound from '../assets/audio/app/call.mp3'
import eeRingtoneSound from '../assets/audio/app/call_ee.mp3'
import { mapGetters, mapActions } from 'vuex'

export default {
	setup() {
		const ringtone = useSound(ringtoneSound, {
			interrupt: true,
		})
		const eeRingtone = useSound(eeRingtoneSound, {
			interrupt: true,
		})

		const pr = () => {
			if (Math.random() > 0.05) ringtone.play()
			else eeRingtone.play()
		}

		const stopRingtone = () => {
			ringtone.stop()
			eeRingtone.stop()
		}

		return {
			playRingtone: pr,
			stopRingtone,
		}
	},
	data: function () {
		return {
			showCallModal: false,
			username: 'John',
			callStack: 0,
		}
	},
	computed: {
		...mapGetters({
			incomingCalls: 'peer/getReceiveCalls',
			metadata: 'peer/getUserMetadata',
		}),
	},
	watch: {
		incomingCalls: {
			deep: true,
			handler(v) {
				if (v.length > this.callStack) {
					this.playRingtone()
				}
				this.callStack = v.length
				if (v.length == 0) this.stopRingtone()

				this.username =
					this.metadata(v[v.length - 1]?.peer)?.nickname || 'Contact'
			},
		},
	},
	methods: {
		...mapActions('peer', ['initPeer', 'answerCall', 'rejectCall']),
	},
}
</script>
<style>
.text-black {
	color: #000;
}
</style>
