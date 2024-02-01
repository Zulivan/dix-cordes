<template>
	<div
		:class="showModal() ? 'modal' : 'modal fade'"
		:style="{ display: showModal() ? 'block' : 'none' }"
		tabindex="-1"
	>
		<div class="modal-dialog text-black" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="incomingCallModalLabel">
						{{
							modalHeader ? modalHeader : $t('call.calling.title')
						}}
					</h5>
					<button
						type="button"
						class="close"
						data-dismiss="modal"
						aria-label="Close"
						@click="() => closeModal()"
					>
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<p>
						{{
							modalBody
								? modalBody
								: $t('call.calling.status.' + callStatus)
						}}
					</p>
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-success"
						@click="() => answerCall()"
						v-show="callStack > 0"
					>
						{{ $t('call.answer') }}
					</button>
					<button
						type="button"
						class="btn btn-danger"
						data-dismiss="modal"
						@click="() => rejectCall()"
						v-show="callStack > 0"
					>
						{{ $t('call.reject') }}
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
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
	setup() {
		const ringtone = useSound(ringtoneSound, {
			interrupt: true,
			loop: true,
		})
		const eeRingtone = useSound(eeRingtoneSound, {
			interrupt: true,
			loop: true,
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
			modalHeader: '',
			modalBody: '',
			callStack: 0,
		}
	},
	computed: {
		...mapGetters({
			incomingCalls: 'peer/getReceiveCalls',
			metadata: 'peer/getUserMetadata',
			callStatus: 'peer/getCallStatus',
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
				if (v.length == 0) {
					this.stopRingtone()
					this.modalHeader = ''
					this.modalBody = ''
				} else {
					const nickname =
						this.metadata(v[v.length - 1]?.peer)?.nickname ||
						'Inconnu'
					this.modalHeader = nickname + ' vous appelle'
					this.modalBody = nickname + ' souhaite vous appeler...'
				}
			},
		},
	},
	methods: {
		...mapActions('peer', ['initPeer', 'answerCall', 'rejectCall']),
		...mapMutations('peer', ['setCallStatus']),

		showModal() {
			if (this.callStack > 0 || this.callStatus) return true
		},

		closeModal() {
			console.log('close modal')
			this.stopRingtone()
			this.callStack = 0
			this.setCallStatus('')
			this.modalHeader = ''
			this.modalBody = ''
		},
	},
}
</script>
<style>
.text-black {
	color: #000;
}
</style>
