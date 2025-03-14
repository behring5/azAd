<h1>HTML Ad Boilerplate/Toolkit</h1>

-  index.html
-  style.css
-  azAd.js
-  assets folder

index.html

<h2>azAd.js - a basic toolkit for everyday work issues</h2>
azAd.js includes a small selectiom of functions, which either could be usefull for ad creation tasks, or ad operation tasks.

<h3>getUrlParam(string)</h3>

---

<h3>Clickout</h3>
Clickouts in digital ads are often <b>not</b> triggered by HTML a-tags, but instead by a <code>window.open()</code> javascript function.
The link is either hardcoded defined in a variable called <code>clickTag</code> or is parsed into the ad via URL parameter.

By default azAd.js is checking for a URL parameter "clicktag" in the URL (e.g. https://cdnserver.com/myad/?clicktag=https://example.com) and assigns it to the whole html body as clickoutlink.
<br><br>
If you want to specifiy certain elements to be clickable only, you can add their IDs to the array <code>clickableElementIds</code> in the index.html. Then only the sepcified elements are clickable.

---
