const fs = require('fs');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = pkg.version;
const repo = pkg.repository.url;
const author = typeof pkg.author === 'object' ? `${pkg.author.name} <${pkg.author.email}>` : pkg.author;

// Sync version in package-lock.json
const lockPath = 'package-lock.json';
const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
lock.version = version;
if (lock.packages?.['']) lock.packages[''].version = version;
fs.writeFileSync(lockPath, JSON.stringify(lock, null, '\t'));
console.log(`✔ package-lock.json → v${version}`);

// Sync AZ_VERSION in azAd.js before Terser minifies it
const azAdPath = 'src/azAd.js';
const azAdSrc = fs.readFileSync(azAdPath, 'utf8');
fs.writeFileSync(azAdPath, azAdSrc.replace(/const AZ_VERSION = '[\d.]+';/, `const AZ_VERSION = '${version}';`));
console.log(`✔ AZ_VERSION → v${version}`);

// Prepend banner to all output files after build
const files = [
	{ path: 'src/azAd.js', title: 'azAd Boilerplate' },
	{ path: 'src/azAd.min.js', title: 'azAd Boilerplate' },
	{ path: 'src/style.css', title: 'azAd Boilerplate' },
	{ path: 'src/style.min.css', title: 'azAd Boilerplate' },
	{ path: 'tools/preview-mode/azPreview.js', title: 'azAd Boilerplate — Preview Mode' },
	{ path: 'tools/preview-mode/azPreview.min.js', title: 'azAd Boilerplate — Preview Mode' },
	{ path: 'tools/preview-mode/azPreview.css', title: 'azAd Boilerplate — Preview Mode' },
	{ path: 'tools/preview-mode/azPreview.min.css', title: 'azAd Boilerplate — Preview Mode' },
];

files.forEach(({ path: filePath, title }) => {
	const banner = `/*!\n * ${title} v${version}\n * ${repo}\n * ${author}\n */\n`;
	let content = fs.readFileSync(filePath, 'utf8');
	while (content.startsWith('/*!')) content = content.replace(/^\/\*![\s\S]*?\*\/\n/, '');
	fs.writeFileSync(filePath, banner + content);
	console.log(`✔ banner → ${filePath}`);
});
