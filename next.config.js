// next.config.js
const withPreact = require('next-plugin-preact');

module.exports = withPreact({
	// Here we configure and set up the Agility CDN domain config so we can take advantage of the next/image component
	// Read more about next/image here: https://nextjs.org/docs/api-reference/next/image
	images: {

		domains: [
			`cdn.aglty.io`,
			`cdn-dev.aglty.io`,
			`${process.env.AGILITY_GUID}-cdn.agilitycms.cloud`,
		],
	},

	i18n: {
		// These are all the locales you want to support in
		// your application
		locales: ['en-us', 'de-de'],
		// This is the default locale you want to be used when visiting
		// a non-locale prefixed path e.g. `/hello`
		defaultLocale: 'en-us',
	},

});
