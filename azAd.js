/////////////////////////////
// Clickout functionality
(function () {
	let clickTagFound = false;

	const urlClickTag = getUrlParam('clicktag');
	if (typeof urlClickTag === 'string' && typeof urlClickTag !== 'undefined' && urlClickTag !== '') {
		clickTag = urlClickTag;
		clickTagFound = true;
		azLog({ success: 'clickTag-URL-Parameter found: ' + clickTag });
	} else if (typeof clickTag !== 'undefined' && clickTag != '') {
		clickTagFound = true;
		azLog({ success: 'hardcoded clickTag found: ' + clickTag });
		azLog({ warning: 'hardcoded clickTag will be overwritten when ad is called with ?clicktag=[CLICKURL]' });
	} else {
		azLog({ error: 'no clickTag found. Try calling the ad with url parameter: ?clicktag=[CLICKURL]' });
	}

	if (clickTagFound) {
		if (typeof clickableElementIds != 'undefined' && clickableElementIds.length > 0) {
			for (let i = 0; i < clickableElementIds.length; i++) {
				const el = document.getElementById(clickableElementIds[i]);

				if (el) {
					el.addEventListener(
						'click',
						(e) => {
							e.stopPropagation();
							window.open(clickTag, '_blank');
						},
						true
					);
					el.style.cursor = 'pointer';
				} else {
					azLog({ error: 'clickable Element with Id "' + clickableElementIds[i] + '" not found' });
				}
			}
		} else {
			azLog({ info: 'no clickable Elements defined --> full body is clickable' });
			const body = document.body;
			body.style.cursor = 'pointer';
			body.addEventListener('click', (e) => {
				window.open(clickTag, '_blank');
			});
		}
	}
})();

/////////////////////////////
/// get URL query parameter (true = key found, but no value)
function getUrlParam(string) {
	let urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has(string)) {
		if (urlParams.get(string) !== '') {
			return decodeURIComponent(urlParams.get(string));
		} else {
			return true; //parameter key found, but value empty
		}
	} else {
		return; //no parameter found
	}
}

/////////////////////////////
/// ad tag Generator
document.addEventListener('keydown', function (event) {
	if (event.key === 'F10') {
		event.preventDefault();
		generateAzTag();
	}
});

function generateAzTag() {
	//prettier ignore
	const adScript = `<script>
    var azAd = {
        src: '${window.location.origin + window.location.pathname}',
        clickout: '[CLICKMACRO]',
        width: '[CREATIVE_WIDTH]',
        height: '[CREATIVE_HEIGHT]',
	};
var azFrame ='<iframe src="'+azAd.src+'?clicktag='+encodeURIComponent(azAd.clickout)+'" style="width:'+azAd.width+';height:'+azAd.height+';border:0px #fff none;" scrolling="no" frameborder="0" allowfullscreen></iframe><style>body,html{width:100%;height:100%;padding:0;margin:0}</style>';document.write(azFrame);
</script>`;

	const codeblock = create('textarea', {
		spellcheck: 'false',
		style: 'position:absolute;z-index:999999;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;height:300px;padding:20px;box-shadow:0 0 80px -50px #000',
		autofocus: 'true',
		content: adScript,
	});
	//codeblock.select();
	document.documentElement.appendChild(codeblock);
	document.documentElement.appendChild(create('style', { content: 'html{width:100%;height:100%;}' }));
}

/////////////////////////////
/// handy function to create DOM elements
function create(type, ...args) {
	const el = document.createElement(type);
	const settings = args[0];

	for (const [key, value] of Object.entries(settings)) {
		if (typeof value != 'undefined') {
			if (key.indexOf('content') == 0) {
				el.innerHTML = value;
			} else {
				el.setAttribute(key, value);
			}
		}
	}
	return el;
}

/////////////////////////////
/// function to load trackingpixel
function track(pxlUrl) {
	let url = pxlUrl;
	if (pxlUrl.includes('[timestamp]')) {
		url = pxlUrl.replace('[timestamp]', Math.round(Math.random() * 100000));
	} else {
		url = pxlUrl;
	}
	const pixel = document.createElement('img');
	pixel.src = url;
	azLog({ success: 'Tracking pixel loaded: ' + url });
}

/////////////////////////////
/// custom console.log function for custom azAd logs
function azLog(obj) {
	const a = `border-radius: 2px 0 0 2px;padding:0 3px 0 3px;font-weight:bold;color:#ffffff;`;
	const b = `border-radius:0 2px 2px 0;padding:0 3px 1px 3px;font-weight:bold;`;
	if (obj.error) {
		console.log('%cAZ%cError', `background:red;${a}`, `background:#f8d7da;color:#ff0000;${b}`, obj.error);
	} else if (obj.warning) {
		console.log('%cAZ%cWarning', `background:orange;${a}`, `background:#f8d7da;color:#ff8400;${b}`, obj.warning);
	} else if (obj.info) {
		console.log('%cAZ%cInfo', `background:#007bff;${a}`, `background:#cce5ff;color:#007bff;${b}`, obj.info);
	} else if (obj.success) {
		console.log('%cAZ%cSuccess', `background:#00af28;${a}`, `background:#d4edda;color:#00af28;${b}`, obj.success);
	} else {
		console.log(obj);
	}
}

/////////////////////////////
/// removing .preload class, when everything is loaded to avoid visible init keyframe animations
window.addEventListener('load', () => document.documentElement.classList.remove('preload'));
