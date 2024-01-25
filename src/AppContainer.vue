<template>
	<router-view />
</template>

<script>
import axios from 'axios'
export default {
	mounted() {
		axios.defaults.baseURL = process.env.VUE_APP_API_URL
	},
}
</script>

<style>
*[style*='display: none'] {
	display: none !important;
}

::-webkit-scrollbar {
	width: 12px;
	background: rgb(49, 49, 49);
}

::-webkit-scrollbar-thumb {
	background: rebeccapurple;
}

::-webkit-scrollbar-corner {
	background: #000;
}

body {
	display: flex;
	flex-direction: column;
	height: 100vh;
	scrollbar-color: rebeccapurple rgb(49, 49, 49);
	scrollbar-width: thin;
}

.message-invis {
	color: #242424;
}

.btn {
	white-space: normal;
}

.lds-ring {
	display: inline-block;
	position: relative;
	width: 80px;
	height: 80px;
}

.lds-ring div {
	box-sizing: border-box;
	display: block;
	position: absolute;
	width: 64px;
	height: 64px;
	margin: 8px;
	border: 8px solid #fff;
	border-radius: 50%;
	animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
	border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
	animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
	animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
	animation-delay: -0.15s;
}
@keyframes lds-ring {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.full-height {
	min-height: 100vh;
}

.messagebox {
	overflow: auto;
	flex-grow: 1;
	flex-basis: 0;
	margin: 10px;
}

.content {
	width: 90%;
}

.contacts {
	background-color: #373737;
}

#typing {
	height: 20px;
}

.overlay {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(0, 0, 0, 0.4);
	transition: opacity 500ms;
	visibility: visible;
	opacity: 1;
}

.popup {
	background-color: #282828 !important;
	color: white;
	margin: 70px auto;
	padding: 20px;
	border-radius: 5px;
	width: 30%;
	position: relative;
	transition: all 0.2s ease-in-out;
	display: flex;
	flex-direction: column;
}

.popup img {
	width: 60%;
	height: 60%;
}

.statusTab {
	border-radius: 50%;
	border: black solid;
	border-width: 2px;
	width: 20px;
	height: 20px;
	display: inline-block;
}

.h-auto {
	height: auto;
}

.messageEditor {
	position: absolute;
	bottom: 0;
	left: 0;
	padding: 5px 5px;
	border: rgb(32, 32, 32) solid;
	background-color: #111111;
	color: white;
}
.cercle {
	border-radius: 50%;
	background: #ff3a3a;
	border: black solid;
	width: 30px;
	height: 30px;
	position: relative;
	font-size: 15px;
	color: white;
	left: 65%;
	bottom: 40%;
}

.chat {
	background-color: #282828 !important;
}

.shake {
	animation: shake-animation 6s ease infinite;
	transform-origin: 50% 50%;
	animation-iteration-count: infinite;
}
@keyframes shake-animation {
	0% {
		transform: translate(0, 0);
	}
	1.78571% {
		transform: translate(5px, 0);
	}
	3.57143% {
		transform: translate(0, 0);
	}
	5.35714% {
		transform: translate(5px, 0);
	}
	7.14286% {
		transform: translate(0, 0);
	}
	8.92857% {
		transform: translate(5px, 0);
	}
	10.71429% {
		transform: translate(0, 0);
	}
	100% {
		transform: translate(0, 0);
	}
}

.message {
	background-color: #242424;
	overflow-wrap: anywhere;
}

.message:hover {
	background-color: #161616;
}

.shadow {
	z-index: 1;
	box-shadow: -15px 5px 20px 4px #373737;
}

.message-img {
	float: left;
	width: 60px;
	height: 60px;
}

.message-img-r {
	float: right;
	width: 60px;
	height: 60px;
}
</style>
