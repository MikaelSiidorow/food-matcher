/** @type {import("tailwindcss").Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		height: {
			screen: ["100vh", "100svh"],
		},
		extend: {
			height: {
				"screen-1/2": ["50vh", "50svh"],
			},
		},
	},
	plugins: [],
};
