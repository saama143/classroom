/*
 * Copyright 2011 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This script serves as an intermediary between oauth2.html and oauth2.js.

// Get all query string parameters from the original URL.
//alert("s")
//var views = browser.extension.getViews({type:'popup'});


var url = window.location.href;
var index = url.indexOf('?');
if (index > -1) {
  url = url.substring(0, index);
}
var adapterName = 'google' //OAuth2.lookupAdapterName(url);
var finisher = new OAuth2(adapterName, 'finish');
var timeleft = 6;
var downloadTimer = setInterval(function(){
	$('#smtimer').text(--timeleft);
	if(timeleft <= 0) {
		clearInterval(downloadTimer);
		browser.tabs.update({
			url: 'addon-page.html#page=dashboard'
		});
	}
},1000);
