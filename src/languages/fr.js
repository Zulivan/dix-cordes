export default {
	sidebar: {
		tabs: {
			contacts: 'Contacts',
			archives: 'Conversations archivées',
		},
	},
	conversationList: {
		noConversations: 'Aucune conversation',
		noArchives: 'Aucune conversation archivée',
	},
	contactList: {
		title: 'Vos contacts',
		subtitle: 'Cliquez sur un contact pour commencer une conversation',
		add: 'Ajouter un contact',
	},
	call: {
		answer: 'Répondre',
		reject: 'Racrocher',
		calling: {
			title: 'Appel en cours...',
			cancel: 'Annuler',
			status: {
				connecting: 'Connexion au serveur de communication...',
				reaching: "Connexion à l'utilisateur...",
				unreachable: 'Utilisateur injoignable',
				answered: 'Appel accepté',
				ended: 'Appel terminé',
				rejected: 'Appel rejeté',
			},
		},
	},
	app: {
		sourceCode: 'Code source',
		logout: 'Déconnexion',
		login: 'Connexion',
		register: "S'inscrire",
		home: 'Accueil',
		edit: 'Éditer',
		search: 'Rechercher...',
		auth: {
			errors: {
				missingUsername: "Veuillez entrer un nom d'utilisateur",
				missingPassword: 'Veuillez entrer un mot de passe',
				passwordsDontMatch: 'Les mots de passe ne correspondent pas',
				usernameTooShort: "Le nom d'utilisateur est trop court",
				passwordTooWeak: 'Le mot de passe est trop faible',
				unknownUsername: 'Utilisateur non trouvé',
				unknownAccount: 'Compte inconnu ou mot de passe incorrect',
			},
			passwordCriteria: {
				title: 'Le mot de passe doit contenir les éléments suivants :',
				uppercase: 'Lettre majuscule',
				lowercase: 'Lettre minuscule',
				number: 'Un chiffre',
				special: 'Un caractère spécial',
				length: 'Minimum 8 caractères',
			},
		},
		status: {
			online: 'En ligne',
			away: 'Absent',
			busy: 'Occupé',
			offline: 'Hors ligne',
		},
	},
	conversation: {
		header: 'Conversation avec {nickname}',
		placeholder: "Saisissez votre message ici pour l'envoyer à {nickname}",
		send: 'Envoyer',
	},
	settings: {
		language: 'Langue',
		title: 'Paramètres',
		passwordConfirmation: 'Confirmation du mot de passe',
		subtitle: 'Modifiez vos paramètres ici...',
		nickname: 'Pseudo',
		password: 'Mot de passe',
		email: 'Email',
		motd: 'Message personnel',
		status: 'Statut',
		save: 'Enregistrer',
		cancel: 'Annuler',
	},
}