(function () {
	if (window.self !== window.top) {
		return;
	}
	const PREVIEW_CSS = '../previewFeature/azPreview.min.css';
	const adContent = document.documentElement.outerHTML; // the actual ad

	//clearing the whole page
	document.documentElement.innerHTML = htmlSceleton(PREVIEW_CSS, 'preview', previewPage());
	console.clear();

	document.title = 'PREVIEW - ' + adContent.substring(adContent.indexOf('<title>') + 7, adContent.lastIndexOf('</title>'));
	const adIframe = createIframe('adIframe', adContent);
	const websiteIframe = createIframe('websiteIframe', htmlSceleton(PREVIEW_CSS, 'previewWebsite', websiteContent()));
	document.getElementById('websiteplaceholder').replaceWith(websiteIframe);
	websiteIframe.contentDocument.getElementById('adContainer').appendChild(adIframe);
})();

// Function to generate iFrame (we'll need two iframes)
function createIframe(elId, content) {
	const iframe = create('iframe', { id: elId });
	iframe.onload = function () {
		if (iframe.contentDocument) {
			iframe.contentDocument.open();
			iframe.contentDocument.write(content);
			iframe.contentDocument.close();
		}
		if (elId == 'adIframe') {
			formatCheck(iframe);
		}
	};
	return iframe;
}

function formatCheck(el) {
	const urlSize = getUrlParam('preview');
	if (!urlSize || urlSize == true) {
		el.parentNode.innerHTML = 'missing preview=??? size in url';
		return;
	}

	const numericRegex = /(\d+)x(\d+)/; // check for num values
	const match = urlSize.match(numericRegex);
	if (match) {
		return `width:${match[1]}px;height:${match[2]}px`;
	}

	const str = urlSize.toLowerCase(); // check for string size
	const possibleSizes = ['int', 'mrec', 'mpu', 'hpa', 'banner'];
	if (str && possibleSizes.includes(str)) {
		el.classList.add(str);
		if (str == 'int') {
			const btn = create('div', { id: 'close' });
			btn.addEventListener('click', (e) => {
				e.target.remove();
				el.remove();
			});
			el.parentNode.appendChild(btn);
		}
	} else {
		el.parentNode.innerHTML = 'This size does not exist. Try num values like 300x600';
	}
}

function htmlSceleton(cssSource, bodyClass, bodyContent) {
	return `
        <html>
        <head>
            <title>Preview</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <link rel="stylesheet" href="${cssSource}">
        </head>
            <body class="${bodyClass}">
                ${bodyContent}
            </body>
        </html>
        `;
}

function previewPage() {
	return `
    <div id="previewPhone" class="bars">
        <div id="browser">
            <div id="browserTop" class="browserbars" >
                <div id="statusbar">
                    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="m15 3.5v9a1 1 0 1 1-2 0v-9a1 1 0 1 1 2 0zm-4 9v-7a1 1 0 0 0-2 0v7a1 1 0 1 0 2 0zm-4-5v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 2 0zm-4 2v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 2 0z"/></svg>
                    <span id="time">12:00</span>
                    <svg id="batt" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" xmlns:v="https://vecta.io/nano"><path d="M14.8 6.1V4.8c0-.7-.6-1.2-1.2-1.2H1.2C.6 3.6 0 4.1 0 4.8v6.4c0 .7.6 1.2 1.2 1.2h12.3c.7 0 1.2-.6 1.2-1.2V9.9H16V6.1h-1.2zm-.6 5.1a.65.65 0 0 1-.6.6H1.2a.65.65 0 0 1-.6-.6V4.7a.65.65 0 0 1 .6-.6h12.4a.65.65 0 0 1 .6.6v6.5zM6.8 4.7H5c-.3 0-.5.3-.5.5v5.5a.47.47 0 0 0 .5.5h1.8a.47.47 0 0 0 .5-.5V5.2c-.1-.2-.3-.5-.5-.5zm-3.1 0H2c-.3 0-.5.3-.5.5v5.5a.47.47 0 0 0 .5.5h1.8a.47.47 0 0 0 .5-.5V5.2c-.1-.2-.3-.5-.6-.5z"/></svg>
                </div>
                <div id="adressbar"></div>
            </div>
            <div id="websiteplaceholder"></div> 
            <div id="browserBottom" class="browserbars" ></div>
        </div>
    </div>
    `;
}

function websiteContent() {
	return `
        <div id="header">
            <div class="brand-logo"></div>
            <div class="brand-name"></div>
            <div class="mobile-menu-button">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
        </div>
        <div id="adContainer"></div>
        ${websiteArticle(45)}
        `;
}

function websiteArticle(n) {
	randomWidth = () => ~~(Math.random() * 20) + 60; // for randomized linelength
	let string = '';
	for (let i = 0; i < n; i++) {
		string += ` <div class="article">
                        <div class="artimg"></div>
                        <div class="lineholder">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div style="width:${randomWidth()}%"></div>
                            <div style="width:${randomWidth()}%"></div>
                        </div>
                    </div>`;
	}
	return string;
}

function bottomBar() {
	return `
    <div data-v-7cc7a05d="" class="button-row"><div data-v-7cc7a05d="" class="button"><svg data-v-6e10d127="" data-v-7cc7a05d="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" class="icon--default icon--light" tabindex="-1"><path fill="currentColor" d="M15 6.988H3.414l3.293-3.293A1 1 0 0 0 5.293 2.28l-5 5a1 1 0 0 0 0 1.414l5 5a1 1 0 1 0 1.414-1.414L3.414 8.988H15a1 1 0 1 0 0-2Z"></path></svg></div><div data-v-7cc7a05d="" class="button"><svg data-v-6e10d127="" data-v-7cc7a05d="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" class="icon--default icon--light" tabindex="-1"><path fill="currentColor" d="M1 6.988h11.586L9.293 3.695a1 1 0 0 1 1.414-1.414l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 1 1-1.414-1.414l3.293-3.293H1a1 1 0 0 1 0-2Z"></path></svg></div><div data-v-7cc7a05d="" class="button"><svg data-v-6e10d127="" data-v-7cc7a05d="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" class="icon--default icon--light" tabindex="-1"><path fill="currentColor" fill-rule="evenodd" d="M7 13a1 1 0 1 0 2 0V9h4a1 1 0 1 0 0-2H9V3a1 1 0 1 0-2 0v4H3a1 1 0 0 0 0 2h4v4z" clip-rule="evenodd"></path></svg></div><div data-v-7cc7a05d="" class="button"><svg data-v-6e10d127="" data-v-7cc7a05d="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" class="icon--default icon--light" tabindex="-1"><path fill="currentColor" fill-rule="evenodd" d="M0 3a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3Zm3-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H3Z" clip-rule="evenodd"></path></svg></div><div data-v-7cc7a05d="" class="button"><svg data-v-6e10d127="" data-v-7cc7a05d="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" class="icon--default icon--light" tabindex="-1"><path fill="currentColor" fill-rule="evenodd" d="M3.5 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6 1.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM14 8a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z" clip-rule="evenodd"></path></svg></div></div>
    `;
}
