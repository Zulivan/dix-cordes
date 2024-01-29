<template>
	<div class="row p-3 text-white" style="background: black">
		<div class="col-12">
			<div class="row">
				<div
					:class="{
						'col-6 col-md-6 col-lg-3 p-2': showcase == -1,
						'col-12': showcase == index,
					}"
					v-for="(streamMeta, index) in streams"
					:key="index"
					v-show="showcase == -1 || showcase == index"
				>
					<video
						:id="'remoteVideo' + index"
						style="width: 100%; height: 100%"
						:srcObject="streamMeta.stream"
						:style="{
							border:
								streamMeta?.peer === 'self'
									? '5px solid red'
									: '5px solid cyan',
							cursor:
								streamMeta?.peer !== 'self'
									? 'pointer'
									: 'default',
							backgroundColor: 'black',
						}"
						:muted="streamMeta?.peer == 'self' || streamMeta?.mute"
						autoplay
						playsinline
						:onClick="
							() =>
								showcase == index
									? (showcase = -1)
									: (showcase = index)
						"
					></video>
					<div
						style="
							position: absolute;
							margin: auto;
							box-sizing: border-box;
							top: 0;
							left: 0;
							right: 0;
							background: rgba(0, 0, 0, 0.5);
							color: white;
							text-align: center;
						"
					>
						{{
							streamMeta.peer == 'self'
								? 'Moi'
								: metadata(streamMeta.peer)?.nickname || '...'
						}}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	data: function () {
		return {
			showcase: -1,
			username: '',
			callStack: 0,
		}
	},
	computed: {
		...mapGetters({
			streams: 'peer/getRemoteStreams',
			metadata: 'peer/getUserMetadata',
		}),
	},
	methods: {
		...mapActions('peer', ['initPeer', 'answerCall', 'rejectCall']),
	},
}
</script>
