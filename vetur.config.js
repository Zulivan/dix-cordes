// vetur.config.js
/** @type {import('vls').VeturConfig} */
module.exports = {
	settings: {
		'vetur.useWorkspaceDependencies': true,
		'vetur.experimental.templateInterpolationService': true,
	},
	projects: [
		{
			root: './',
			package: './package.json',
			jsconfig: './jsconfig.json',
			snippetFolder: './.vscode/vetur/snippets',
			globalComponents: ['./src/components/**/*.vue'],
		},
	],
}
