(function () {
	if (window.self !== window.top) {
		return;
	}

	//const PREVIEW_CSS = '../azAd_previewMode/azPreview.css'; //this is for dev mode
	const PREVIEW_CSS = 'https://cdn.jsdelivr.net/gh/behring5/azAd_boilerplate@master/azAd_previewMode/azPreview.min.css';
	console.clear();
	console.log('Loading Preview...');
	window.addEventListener(
		'click',
		(event) => {
			event.stopImmediatePropagation();
		},
		true
	);
	//creating the adiFrameURL
	const params = new URLSearchParams(window.location.search);
	params.delete('preview');
	const iframeAdURL = window.location.protocol + '//' + window.location.host + window.location.pathname + `?` + params.toString();
	const adIframe = create('iframe', { id: 'adIframe', src: iframeAdURL, scrolling: 'no' });

	const title = document.title;
	document.documentElement.innerHTML = htmlSkeleton('preview', previewPage()); //clearing the whole page and adding previewHTML
	document.title = 'PREVIEW - ' + title;

	document.getElementById('websiteplaceholder').replaceWith(createDummyWebsite());
	websiteIframe.contentDocument.getElementById('adContainer').appendChild(adIframe);
	formatCheck(adIframe);

	function createDummyWebsite() {
		const iframe = create('iframe', { id: 'websiteIframe' });
		const html = htmlSkeleton('dummyWebsite', dummyWebsiteContent());
		iframe.onload = function () {
			if (iframe.contentDocument) {
				iframe.contentDocument.open();
				iframe.contentDocument.write(html);
				iframe.contentDocument.close();
			}
		};
		return iframe;
	}

	function formatCheck(el) {
		const urlSize = getUrlParam('preview');
		if (!urlSize || urlSize == true) {
			el.parentNode.innerHTML = 'missing size in url preview=???';
			return;
		}

		const numericRegex = /(\d+)x(\d+)/; // check for num values
		const match = urlSize.match(numericRegex);
		if (match) {
			el.setAttribute('style', `width:${match[1]}px;height:${match[2]}px`);
			return;
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

	function htmlSkeleton(bodyClass, bodyContent) {
		return `
        <html><head>
            <title>Preview</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <link rel="stylesheet" href="${PREVIEW_CSS}">
        </head><body class="${bodyClass}">${bodyContent}</body></html>
        `;
	}

	function previewPage() {
		return `
            <div id="previewPhone" class="">
                <div id="phoneInner">
                <div id="browserTop" class="browserbars" >
                    <div id="statusbar">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" xmlns:v="https://vecta.io/nano"><path d="M14 4.1v7.7c0 .5-.4.9-.9.9s-.9-.4-.9-.9V4.1c0-.5.4-.9.9-.9.5.1.9.5.9.9zm-3.4 7.8v-6c0-.5-.4-.9-.9-.9s-.8.4-.8.9v6c0 .5.4.9.9.9.4-.1.8-.5.8-.9zM7.1 7.6v4.3c0 .5-.4.9-.9.9s-.9-.4-.9-.9V7.6c0-.5.4-.9.9-.9.6 0 .9.4.9.9zM3.7 9.3v2.6c0 .5-.4.9-.9.9s-.8-.5-.8-.9V9.3c0-.5.4-.9.9-.9s.8.4.8.9z"/></svg>
                        <span id="time">${getTime()}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" xmlns:v="https://vecta.io/nano"><path d="M14.8 6.1V4.8c0-.7-.6-1.2-1.2-1.2H1.2C.6 3.6 0 4.1 0 4.8v6.4c0 .7.6 1.2 1.2 1.2h12.3c.7 0 1.2-.6 1.2-1.2V9.9H16V6.1h-1.2zm-.6 5.1a.65.65 0 0 1-.6.6H1.2a.65.65 0 0 1-.6-.6V4.7a.65.65 0 0 1 .6-.6h12.4a.65.65 0 0 1 .6.6v6.5zM6.8 4.7H5c-.3 0-.5.3-.5.5v5.5a.47.47 0 0 0 .5.5h1.8a.47.47 0 0 0 .5-.5V5.2c-.1-.2-.3-.5-.5-.5zm-3.1 0H2c-.3 0-.5.3-.5.5v5.5a.47.47 0 0 0 .5.5h1.8a.47.47 0 0 0 .5-.5V5.2c-.1-.2-.3-.5-.6-.5z"/></svg>
                    </div>
                    <div id="adressbar"></div>
                </div>
                <div id="websiteplaceholder"></div> 
                <div id="browserBottom" class="browserbars" ></div>
            </div>
            </div>`;
	}

	function dummyWebsiteContent() {
		return `
        <div id="header">
            <div class="brand-logo"></div>
            <div class="mobile-menu-button"><div></div><div></div><div></div></div>
        </div>
        <div id="adContainer"></div>
        ${websiteArticle(45)}`;
	}

	function websiteArticle(n) {
		randomWidth = () => ~~(Math.random() * 20) + 60; // for randomized linelength
		let string = '';
		for (let i = 0; i < n; i++) {
			string += ` <div class="article"><div></div>
                        <div class="lines">
                            <div></div><div></div><div></div><div style="width:${randomWidth()}%"></div><div style="width:${randomWidth()}%"></div>
                        </div></div>`;
		}
		return string;
	}

	function getTime() {
		const now = new Date();
		return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
	}

	///// ENDE
})();

// Function to generate iFrame
// function createIframe(elId, content) {
// 	const iframe = create('iframe', { id: elId });
// 	iframe.onload = function () {
// 		if (iframe.contentDocument) {
// 			iframe.contentDocument.open();
// 			iframe.contentDocument.write(content);
// 			iframe.contentDocument.close();
// 		}
// 		if (elId == 'adIframe') {
// 			formatCheck(iframe);
// 		}
// 	};
// 	return iframe;
// }
