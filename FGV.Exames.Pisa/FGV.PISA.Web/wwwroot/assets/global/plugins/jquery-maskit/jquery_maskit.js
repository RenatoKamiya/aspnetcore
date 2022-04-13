/*
Plugin: jquery.maskit.js

The MIT License (MIT) [ http://www.opensource.org/licenses/mit-license.php ]
Copyright (c) 2011

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Authors:
Nick Stanko - 3twenty9.com (2011)
Joe Gotthelf - augtech.com (2011)
Jonathan  A. Newell - Rapid Software. (2004-2006)

Purpose: Provides in place edit mask capability using simple edit mask patterns. Dynamically formats inputs as keys are pressed. Distributed as a jQuery plugin for your convenience.
				    
Sample:
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
<script src="jquery.maskit.js"></script>
<script>
	$(function() {
		$('#phone').maskit({format: 'Phone' });
		$('#integer').maskit({format: 'Integer' });
		$('#currency').maskit({format: 'Currency', currmax: 5, precision: '000000' });
		$('#float').maskit({format: 'Float', decimals: 4});
		$('#ssn').maskit({format: 'SSN' });
		$('#zip').maskit({format: 'Zip' });
		$('#date').maskit({format: 'Date' });
		$('#datetime').maskit({format: 'DateTime' });
		$('#time').maskit({format: 'Time' });
	});
</script>

*/

(function($){
    $.fn.extend({ 
        maskit: function(options) {

            var defaults = {
				format: 'Float',
				decimals: 2,
				currmax: 5,
				precision: '000000',
                alphaKeysUpperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_',
				alphaKeysLowerCase: 'abcdefghijklmnopqrstuvwxyz',
				alphaNumericKeys: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_' + 'abcdefghijklmnopqrstuvwxyz' + '1234567890-.',
				alphaKeys: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_' + 'abcdefghijklmnopqrstuvwxyz',
				numericKeys: '1234567890-.',
				allMaskCharacters: '9A$D',
				allDateKeys: '0123456789/',
				allPhoneKeys: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
				allTimeKeys: '0123456789:',
				alphaNumKeys: '1234567890-.' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_' + 'abcdefghijklmnopqrstuvwxyz',
				ssKeys: '1234567890-.Xx',
				canadaZipKeys: '0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ',
				allDateTimeKeys: '0123456789/:',
				specialKey: false
            }
                 
            var options = $.extend(defaults, options);
 
            return this.each(function() {
                var o = options;
				$(this).keypress(function (e) {
					filterKey(o.format, e);
				});
            });

			function filterKey(formatString, e) {
				var o = options; 
				
				var domElement = e.srcElement ? e.srcElement : e.target;

				if (!domElement.KeyHandlersAttached) attachOnKeyDownHandler(domElement, e);

				var domValue = new String(domElement.value);
				
				var keyhit;
				if (window.event)
					keyhit = new Number(parseInt(window.event.keyCode));
				else
					keyhit = new Number(parseInt(e.which));
					
				var keyAsString = String.fromCharCode(keyhit);
				var maskType = getMaskType(o.format);

				if (domElement.readOnly) {
					discardKeyPress(e);
					options.specialKey = false;
					return;
				}

				var selectedText = getSel();
				
				if (selectedText.indexOf(domValue) != -1 && domValue.length > 0) {
					domElement.value = "";
					domValue = "";
				}

				var caretPosition = new Number(getCaretPosition(domElement));
				if ((keyhit == 46 || keyhit == 8) && options.specialKey) {
					//Backspace
					if (keyhit == 8) {
						if (!(caretPosition == 0 || domElement.value.length == caretPosition) || maskType == "CURR") {
							procesDestructiveKeyPress(domElement, caretPosition, keyhit, format, maskType);
						}
						options.specialKey = false;
						return true;
					}

					//Delete
					if (keyhit == 46) {
						if (domElement.value.length != caretPosition) {
							procesDestructiveKeyPress(domElement, caretPosition, keyhit, format, maskType);
						}
						options.specialKey = false;
						return true;
					}
				}

				switch (maskType) {
					//Currency 
					case "CURR":
						if ((o.numericKeys.indexOf(keyAsString) == -1) ||
							(caretPosition == domElement.value.length && domElement.value.length != 0)) {
							discardKeyPress(e);
							options.specialKey = false;
							return;
						}

						domElement.style.textAlign = "right";

						var textRange;
						if(document.selection){
							textRange = domElement.createTextRange();
						} else if (window.getSelection) {
							textRange = null;
						}

						if (domElement.value == "" || domElement.value == "0") {
							domElement.value = "." + o.precision;
							if (textRange !== null) {
								textRange.collapse(true);
								textRange.select();
							} else {
								domElement.selectionStart = 1;
								domElement.selectionEnd = 0;
								domElement.focus();
							}
							options.specialKey = false;
							return;
						}

						var decimalLocation = new Number(domValue.indexOf("."));
						if (keyAsString == "." && decimalLocation > -1) {
							setCaretPosition(domElement, decimalLocation + 1)
							discardKeyPress(e);
							return;
						}

						var caretPosition = new Number(getCaretPosition(domElement));
						if (caretPosition > decimalLocation) {
							//user is keyboarding to the right of the decimal
							domElement.value = domElement.value.substr(0, caretPosition) + keyAsString +
									domElement.value.substring(caretPosition + 1, domElement.value.length);
							setCaretPosition(domElement, caretPosition + 1);
							discardKeyPress(e);
							options.specialKey = false;
							return;
						} else {
							//user is keyboarding to the left of the decimal
							if (decimalLocation > o.currmax-1) {
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}
						}
						break;

					case "#":
						if (o.numericKeys.indexOf(keyAsString) == -1) {
							discardKeyPress(e);
							return;
						}

						if (keyAsString == '-') {
							discardKeyPress(e);
							return;
						}

						if ((o.decimals == undefined || o.decimals <= 0) && keyAsString == '.') {
							discardKeyPress(e);
							return;
						}

						if (domValue.indexOf('.') > -1) {
							var decObj = domValue.split('.');
							if (o.decimals < decObj[1].length + 1) {
								discardKeyPress(e);
								return;
							}
						}
						break;

					case "INT":
						if (o.numericKeys.indexOf(keyAsString) == -1) {
							discardKeyPress(e);
							return;
						}

						if (keyAsString == '-') {
							discardKeyPress(e);
							return;
						}

						if (keyAsString == '.') {
							discardKeyPress(e);
							return;
						}
						break;

					// Time (24/12 hr) 
					case "TIME":
						var hours;
						var minutes;

						// discard if not numeric, ":", "AM/PM"
						if (o.allTimeKeys.indexOf(keyAsString) == -1) {
							discardKeyPress(e);
							return;
						}

						if (domValue.length > 7) {
							discardKeyPress(e);
							options.specialKey = false;
							return;
						}

						// prevent too many ":"
						if (keyAsString == ':' && domValue.length != 2) {
							discardKeyPress(e);
							return;
						}

						// prevent "AM/PM" till the end
						var allTime12Keys = 'APMapm';
						if (allTime12Keys.indexOf(keyAsString) != -1 && domValue.length < 5) {
							discardKeyPress(e);
							return;
						}

						// let's see if we're trying to go above 23 hours
						if (domValue.length == 1) {
							hours = new Number(domElement.value + keyAsString);
							if (hours > 23) {
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}
						}

						//Automatically process the ":" and AM/PM if needed
						if (domValue.length > 1) {
							// no ":" currently exist in the string, and it only has 2 characters in it.

							var hour = new Number(domElement.value.substr(0, 2));
							if (domValue.indexOf(':') == -1 && domValue.length == 1 && hour > 2) {
								if (keyAsString == ':') {
									domElement.value = "0" + hour + ":";
								} else {
									domElement.value = "0" + hour + ":" + keyAsString;
								}
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}

							if (domValue.indexOf(':') == -1 && domValue.length == 2 && keyAsString != ':') {
								if (keyAsString == ':') {
									domElement.value = domElement.value + ":";
								} else {
									domElement.value = domElement.value + ":" + keyAsString;
								}
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}

							// let's see if we're trying to go above 59 minutes
							if (domValue.length == 4) {
								minutes = new Number(domElement.value + keyAsString);
								if (minutes > 59) {
									discardKeyPress(e);
									options.specialKey = false;
									return;
								}
							}

							// if 12 hr
							if (domValue.length > 4 && domValue.indexOf(':') == 2 && hour <= 12) {
								if (keyAsString == 'A' || keyAsString == 'a') {
									domElement.value = domElement.value + " AM";
								}
								if (keyAsString == 'P' || keyAsString == 'p') {
									domElement.value = domElement.value + " PM";
								}
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}

							// if 24 hr
							if (domValue.length > 4 && domValue.indexOf(':') == 2 && hour > 12) {
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}
						}
						break;

					// Social Security 
					case "SS":
						// discard if at end of string
						if (domValue.length == 11) {
							options.specialKey = false;
							discardKeyPress(e);
							return;
						}

						// discard if not numeric or "-"
						if (o.ssKeys.indexOf(keyAsString) == -1) {
							discardKeyPress(e);
							return;
						}

						// prevent too many "-"
						if (keyAsString == '-' && domValue.length != 3 && domValue.length != 6) {
							discardKeyPress(e);
							return;
						}

						//Automatically process the "-"
						if (domValue.length > 0) {
							// no "-" currently exist in the string, and it only has 3 characters in it.
							if (domValue.indexOf('-') == -1 && domValue.length == 3 && keyAsString != '-') {
								domElement.value = domElement.value + "-" + keyAsString;
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}

							// one "-" already exists so this is the 2nd.
							if (domValue.length == 6 && domValue.indexOf('-') == 3 && keyAsString != '-') {
								domElement.value = domElement.value + "-" + keyAsString;
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}
						}
						break;

					// Phone format: 555-555-5555 
					case "PHONEone":
						// discard if not alphanumeric or "-()"
						if (o.allPhoneKeys.indexOf(keyAsString) == -1) {
							discardKeyPress(e);
							return;
						}

						// discard if at end of string
						if (domValue.length == 12) {
							options.specialKey = false;
							discardKeyPress(e);
							return;
						}

						// prevent "()"
						if (keyAsString == '(' || keyAsString == ')') {
							discardKeyPress(e);
							return;
						}

						// prevent too many "-"
						if (keyAsString == '-' && domValue.length != 3 && domValue.length != 7) {
							discardKeyPress(e);
							return;
						}

						// automatically process the "-"
						if (domValue.length > 0) {
							// no "-" currently exist in the string, and it only has 3 characters in it.
							if (domValue.indexOf('-') == -1 && domValue.length == 3 && keyAsString != '-') {
								domElement.value = domElement.value + "-" + keyAsString;
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}

							// one "-" already exists so this is the 2nd.
							if (domValue.length == 7 && domValue.indexOf('-') == 3 && keyAsString != '-') {
								domElement.value = domElement.value + "-" + keyAsString;
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}
						}
						break;

					// Phone format: (555)555-5555 
					case "PHONEtwo":
						// discard if not alphanumeric or "-()"
						if (o.allPhoneKeys.indexOf(keyAsString) == -1) {
							discardKeyPress(e);
							return;
						}

						// discard if at end of string
						if (domValue.length == 13) {
							options.specialKey = false;
							discardKeyPress(e);
							return;
						}

						// prevent too many "-"
						if (keyAsString == '-' && domValue.length != 8) {
							discardKeyPress(e);
							return;
						}

						// prevent too many "("
						if (keyAsString == '(' && domValue.length != 0) {
							discardKeyPress(e);
							return;
						}

						// prevent too many ")"
						if (keyAsString == ')' && domValue.length != 4) {
							discardKeyPress(e);
							return;
						}

						// insert "(" before #s
						if (domValue.length == 0) {
							if (keyAsString != '(') {
								domElement.value = "(" + domElement.value + keyAsString;
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}
						}

						// automatically process the "()" and "-"
						if (domValue.length > 0) {
							// "(" currently exist in the string, and it only has 4 characters.
							if (domValue.indexOf('(') == 0 && domValue.length == 4 && keyAsString != ')') {
								domElement.value = domElement.value + ")" + keyAsString;
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}

							// has 8 characters.
							if (domValue.length == 8 && keyAsString != '-') {
								domElement.value = domElement.value + "-" + keyAsString;
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}
						}
						break;

					// 5 digit ZIP 
					case "ZIPfive":
					case "Zip":
						// discard if not numeric
						if (o.numericKeys.indexOf(keyAsString) == -1) {
							discardKeyPress(e);
							return;
						}
						if (keyAsString == '-' || keyAsString == '.') {
							discardKeyPress(e);
							return;
						}

						// discard if at end of string
						if (domValue.length == 5) {
							options.specialKey = false;
							discardKeyPress(e);
							return;
						}
						break;

					// 9 digit ZIP 
					case "ZIPnine":
					case "ZipLong":
						// discard if not numeric
						if (domValue.length == 0 && o.alphaKeys.indexOf(keyAsString) >= 0)
							return canadaZip(domElement, domValue, keyAsString);

						if (domValue.length > 0 && o.alphaKeys.indexOf(domValue.substr(0, 1)) >= 0)
							return canadaZip(domElement, domValue, keyAsString);


						if (o.numericKeys.indexOf(keyAsString) == -1) {
							discardKeyPress(e);
							return;
						}

						// discard if at end of string
						if (domValue.length == 10) {
							options.specialKey = false;
							discardKeyPress(e);
							return;
						}

						// prevent "."
						if (keyAsString == '.') {
							discardKeyPress(e);
							return;
						}

						// prevent too many "-"
						if (keyAsString == '-' && domValue.length != 5) {
							discardKeyPress(e);
							return;
						}

						// automatically process the "-"
						if (domValue.length > 0) {
							// no "-" currently exist in the string, and it only has 3 characters in it.
							if (domValue.indexOf('-') == -1 && domValue.length == 5 && keyAsString != '-') {
								domElement.value = domElement.value + "-" + keyAsString;
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}
						}
						break;

					//Date 
					case "DATE":
						// discard if at end of string
						if (domValue.length == 10) {
							options.specialKey = false;
							discardKeyPress(e);
							return;
						}

						if (o.allDateKeys.indexOf(keyAsString) == -1) {
							discardKeyPress(e);
							return;
						}

						// prevent too many "/"
						if (keyAsString == '/' && domValue.length != 5 && domValue.length != 2 && domValue.length != 4 && domValue.length != 1) {
							discardKeyPress(e);
							return;
						}

						// no slashes currently exist in the string, and it only has no characters in it.
						if (domValue.indexOf("/") == -1 && domValue.length == 0) {
							if (keyAsString > 1 && keyAsString <= 9) {
								if (keyAsString > 1) {
									domElement.value = "0" + keyAsString + "/";
								}
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}
						}

						//Automatically process the date seperators
						if (keyAsString == "/") {
							if (domValue.length == 3) {
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}

							if (domValue.length > 0) {

								// no slashes currently exist in the string, and it only has one character in it.
								if (domValue.indexOf("/") == -1 && domValue.length == 1) {
									if (domElement.value > "0" && domElement.value < "9") {
										domElement.value = "0" + domElement.value + "/";
										discardKeyPress(e);
										options.specialKey = false;
										return;
									}
								}

								// one slash already exists so this is the day/year slash.
								// if the user has only entered a one digit year then the
								// dom value will be 4 characters min length

								if (domElement.value.length == 4) {
									domElement.value = domElement.value.substr(0, 3) + "0" + domElement.value.substr(3, 1) + "/";
									discardKeyPress(e);
									options.specialKey = false;
									return;
								}


								if (domElement.value.length == 5) {
									domElement.value = domElement.value + "/";
									discardKeyPress(e);
									options.specialKey = false;
									return;
								}
							}
						}


						var month = new Number(parseInt(domValue + keyAsString));

						if (domValue.length == 1 && month > 12) {
							discardKeyPress(e);
							options.specialKey = false;
							return;
						}

						if (domValue.length == 1 && keyAsString != "/") {
							// This completes the month.

							if (keyAsString != "0" || domValue != "0")
								domElement.value += keyAsString + "/";

							discardKeyPress(e);

							return;
						}

						//Validate the Day
						if (domValue.length == 4) {
							var day = new Number(domValue.substr(3, 1) + keyAsString);

							//months with max of 31 days
							if (((month == 1 || month == 3 || month == 5 || month == 7 || month == 8 ||
									month == 10 || month == 12) && day > 31) ||
								((month == 4 || month == 6 || month == 9 || month == 11) && day > 30) ||
								(month == 2 && day > 29)) {
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}
						}

						if (domValue.length == 4 && keyAsString != "/") {
							// This completes the day.

							domElement.value += keyAsString + "/";

							discardKeyPress(e);

							return;
						}

						//Validate the Year
						if (domValue.length == 7) {
							var year = domValue.substr(6, 4) + keyAsString;

							var d = new Date();
							var curCentury = new String(d.getFullYear()).substr(0, 2);

							// make 4 digit year
							if (year.length == 2 && year != "20" && year != "19") {
								domElement.value = domValue.substr(0, 6) + curCentury + year;

								if (domElement.RollOver != null && domElement.RollOver == "true") {
									var curYear = new String(d.getFullYear()).substr(2, 2);
									if (parseFloat(curYear) < parseFloat(year)) {
										var newCentury = new String(parseFloat(curCentury) - 1);
										domElement.value = domElement.value.replace(curCentury + year, newCentury + year);
									}
								}

								discardKeyPress(e);
								options.specialKey = false;
								return;
							}
						}
						if (domElement.value.length == 9) {
							if (domElement.RollOver != null && domElement.RollOver == "true") {
								domElement.value += keyAsString;
								var d = new Date();
								var curCentury = new String(d.getFullYear()).substr(0, 2);
								var curYear = new String(d.getFullYear()).substr(2, 2);
								if (parseFloat(curYear) < parseFloat(domElement.value.substr(8, 2))) {
									var newCentury = new String(parseFloat(curCentury) - 1);
									domElement.value = domElement.value.replace(domElement.value.substr(6, 4), newCentury + domElement.value.substr(8, 2));
								}
								discardKeyPress(e);
								options.specialKey = false;
								return false;
							}
						}

						break;

					//DateTime 
					case "DATETIME":
						if (o.allDateTimeKeys.indexOf(keyAsString) == -1) {
							discardKeyPress(e);
							return;
						}

						// prevent too many "/"
						if (keyAsString == '/' && domValue.length != 5 && domValue.length != 2 && domValue.length != 4 && domValue.length != 1) {
							discardKeyPress(e);
							return;
						}

						if (keyAsString == ' ' && domValue.length != 10) {
							discardKeyPress(e);
							return;
						}

						// no slashes currently exist in the string, and it only has no characters in it.
						if (domValue.indexOf("/") == -1 && domValue.length == 0) {
							if (keyAsString > 1 && keyAsString <= 9) {
								if (keyAsString > 1) {
									domElement.value = "0" + keyAsString + "/";
								}
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}
						}

						//Automatically process the date seperators
						if (keyAsString == "/") {
							if (domValue.length == 3) {
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}

							if (domValue.length > 0) {

								// no slashes currently exist in the string, and it only has one character in it.
								if (domValue.indexOf("/") == -1 && domValue.length == 1) {
									if (domElement.value > "0" && domElement.value < "9") {
										domElement.value = "0" + domElement.value + "/";
										discardKeyPress(e);
										options.specialKey = false;
										return;
									}
								}

								// one slash already exists so this is the day/year slash.
								// if the user has only entered a one digit year then the
								// dom value will be 4 characters min length

								if (domElement.value.length == 4) {
									domElement.value = domElement.value.substr(0, 3) + "0" + domElement.value.substr(3, 1) + "/";
									discardKeyPress(e);
									options.specialKey = false;
									return;
								}


								if (domElement.value.length == 5) {
									domElement.value = domElement.value + "/";
									discardKeyPress(e);
									options.specialKey = false;
									return;
								}
							}
						}


						var month = new Number(parseInt(domValue + keyAsString));

						if (domValue.length == 1 && month > 12) {
							discardKeyPress(e);
							options.specialKey = false;
							return;
						}

						if (domValue.length == 1 && keyAsString != "/") {
							// This completes the month.

							if (keyAsString != "0" || domValue != "0")
								domElement.value += keyAsString + "/";

							discardKeyPress(e);

							return;
						}

						//Validate the Day
						if (domValue.length == 4) {
							var day = new Number(domValue.substr(3, 1) + keyAsString);

							//months with max of 31 days
							if (((month == 1 || month == 3 || month == 5 || month == 7 || month == 8 ||
									month == 10 || month == 12) && day > 31) ||
								((month == 4 || month == 6 || month == 9 || month == 11) && day > 30) ||
								(month == 2 && day > 29)) {
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}
						}

						if (domValue.length == 4 && keyAsString != "/") {
							// This completes the day.

							domElement.value += keyAsString + "/";

							discardKeyPress(e);

							return;
						}

						//Validate the Year
						if (domValue.length == 7) {
							var year = domValue.substr(6, 4) + keyAsString;

							var d = new Date();
							var curYearString = new String(d.getFullYear());

							// make 4 digit year
							if (year.length == 2 && year != "20" && year != "19") {
								domElement.value = domValue.substr(0, 6) + curYearString.substr(0, 2) + year + " ";
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}
						}

						var hours;
						var minutes;

						if (domValue.length > 10) {
							// discard if not numeric, ":", "AM/PM"
							if (allTimeKeys.indexOf(keyAsString) == -1) {
								discardKeyPress(e);
								return;
							}

							if (domValue.length > 17) {
								discardKeyPress(e);
								options.specialKey = false;
								return;
							}

							// prevent too many ":"
							if (keyAsString == ':' && domValue.length != 13 && domValue.length != 12) {
								discardKeyPress(e);
								return;
							}

							// prevent "AM/PM" till the end
							var allTime12Keys = new String("APMapm");
							if (allTime12Keys.indexOf(keyAsString) != -1 && domValue.length < 16) {
								discardKeyPress(e);
								return;
							}

							// let's see if we're trying to go above 23 hours
							if (domValue.length == 12) {
								hours = new Number(domElement.value.substr(11, 2) + keyAsString);
								if (hours > 23) {
									discardKeyPress(e);
									options.specialKey = false;
									return;
								}
							}

							//Automatically process the ":" and AM/PM if needed
							if (domValue.length > 11) {
								// no ":" currently exist in the string, and it only has 2 characters in it.
								var hour = new Number(domValue.substr(11, 2));
								if (domValue.indexOf(':') == -1 && domValue.length == 12 && hour > 2) {
									if (keyAsString == ':') {
										domElement.value = domElement.value.substr(0, 11) + "0" + hour + ":";
									} else {
										domElement.value = domElement.value.substr(0, 11) + "0" + hour + ":" + keyAsString;
									}
									discardKeyPress(e);
									options.specialKey = false;
									return;
								}

								if (domValue.indexOf(':') == -1 && domValue.length == 13) {
									if (keyAsString == ':') {
										domElement.value = domElement.value + ":";
									} else {
										domElement.value = domElement.value + ":" + keyAsString;
									}
									discardKeyPress(e);
									options.specialKey = false;
									return;
								}

								// let's see if we're trying to go above 59 minutes
								if (domValue.length == 15) {
									minutes = new Number(domElement.value.substr(14, 2) + keyAsString);
									if (minutes > 59) {
										discardKeyPress(e);
										options.specialKey = false;
										return;
									}
								}

								// if 12 hr
								if (domValue.length > 15 && domValue.indexOf(':') == 13 && hour <= 12) {
									if (keyAsString == 'A' || keyAsString == 'a') {
										domElement.value = domElement.value + " AM";
									}
									if (keyAsString == 'P' || keyAsString == 'p') {
										domElement.value = domElement.value + " PM";
									}
									discardKeyPress(e);
									options.specialKey = false;
									return;
								}

								// if 24 hr
								if (domValue.length > 15 && domValue.indexOf(':') == 13 && hour > 12) {
									discardKeyPress(e);
									options.specialKey = false;
									return;
								}
							}

						}
						break;

					//Custom 
					case "CUST":
						/// Discard keypresses past the maximum length
						if (domValue.length == format.length) {
							discardKeyPress(e);
							return;
						}
						for (var i = domValue.length; i < format.length; i++) {
							var maskChar = format.charAt(i);
							if (o.allMaskCharacters.indexOf(maskChar) == -1 && maskChar != keyAsString) {
								domElement.value = domElement.value + maskChar;
							}
							else {
								switch (maskChar) {
									case "9":
										if (o.numericKeys.indexOf(keyAsString) == -1) discardKeyPress(e);
										break;
									case "A":
										if (o.alphaKeys.indexOf(keyAsString) == -1) discardKeyPress(e);
										break;
									case "N":
										if (o.alphaNumericKeys.indexOf(keyAsString) == -1) discardKeyPress(e);
										break;
								}
								break;
							}
						}

						break;
				}
				options.specialKey = false;
			}

			function canadaZip(domElement, domValue, keyAsString) {
				// discard if at end of string
				if (domValue.length == 7) {
					options.specialKey = false;
					discardKeyPress(e);
					return;
				}

				// discard if not valid for this format
				keyAsString = keyAsString.toUpperCase();
				if (o.canadaZipKeys.indexOf(keyAsString) == -1) {
					discardKeyPress(e);
					return;
				}

				if (keyAsString == ' ' && domValue.length != 3) {
					discardKeyPress(e);
					return;
				}

				//Automatically process the " "
				if (domValue.length > 0) {
					// no " " currently exist in the string, and it only has 3 characters in it.
					if (domValue.indexOf(' ') == -1 && domValue.length == 3 && keyAsString != ' ') {
						domElement.value = domElement.value + " " + keyAsString;
						discardKeyPress(e);
						options.specialKey = false;
						return;
					}
				}
			}
			
			function getMaskType(format) {
				var mask = new String(format);
				if (mask.indexOf("SSN") > -1) return "SS";
				if (mask.indexOf("$.$") > -1) return "CURR";
				if (mask.indexOf("$") > -1) return "CURR";
				if (mask.indexOf("Currency") > -1) return "CURR";
				if (mask.indexOf("Float") > -1) return "#";
				if (mask.indexOf("#") > -1) return "#";
				if (mask.indexOf("Number") > -1) return "INT";
				if (mask.indexOf("Integer") > -1) return "INT";
				if (mask.indexOf("INT") > -1) return "INT";
				if (mask.indexOf("DateTime") > -1) return "DATETIME";
				if (mask.indexOf("Date") > -1) return "DATE";
				if (mask.indexOf("Time") > -1) return "TIME";
				if (mask.indexOf("Phone") > -1) return "PHONEone";
				if (mask.indexOf("PhoneOne") > -1) return "PHONEone";
				if (mask.indexOf("PhoneTwo") > -1) return "PHONEtwo";
				if (mask.indexOf("Zip") > -1) return "ZIPfive";
				if (mask.indexOf("ZIPfive") > -1) return "ZIPfive";
				if (mask.indexOf("ZIPnine") > -1) return "ZIPnine";
				return "CUST";
			}

			function procesDestructiveKeyPress(domElement, caretPosition, keypress, format, maskType) {
				var oldValue = new String(domElement.value);
				var newValue = new String();
				if (keypress == 8) caretPosition--;

				switch (maskType) {
					case "CURR":

						// Cant destroy the decimal itself
						if (domElement.value.substr(caretPosition, 1) == ".") {
							discardKeyPress(e);
							return;
						}

						if (caretPosition > domElement.value.indexOf(".")) {
							domElement.value = domElement.value.substr(0, caretPosition) + "0" +
								(caretPosition < domElement.value.length
								? domElement.value.substring(caretPosition + 1, domElement.value.length) : "");
							setCaretPosition(domElement, caretPosition);
							discardKeyPress(e);
						}

						break;

					case "CUST":

						if (allMaskCharacters.indexOf(format.substr(caretPosition, 1)) == -1) {
							discardKeyPress(e);
							return;
						}

						var nonLiterals = new String("");
						for (var i = new Number(caretPosition + 1); i < oldValue.length; i++) {
							if (allMaskCharacters.indexOf(format.substr(i, 1)) > -1) nonLiterals += oldValue.substr(i, 1);
						}

						if (nonLiterals.length > 0) {
							//Lay Literals Back Across Mask begining at insertion point
							newValue = oldValue.substr(0, caretPosition);
							var nonLiteralsIndex = new Number(0);
							for (var i = new Number(caretPosition); i < format.length; i++) {
								if (allMaskCharacters.indexOf(format.substr(i, 1)) > -1) {
									newValue += nonLiterals.substr(nonLiteralsIndex, 1);
									nonLiteralsIndex++;
								}
								else newValue += format.substr(i, 1);
								if (nonLiteralsIndex >= nonLiterals.length) break;
							}
						}
						domElement.value = newValue;
						discardKeyPress(e);
						setCaretPosition(domElement, caretPosition);
						break;
				}
			}
			
			function setCaretPosition(oField, iCaretPos) {
				// IE Support
				if (document.selection) {
					// Set focus on the element
					oField.focus();
					// Create empty selection range
					var oSel = document.selection.createRange();
					// Move selection start and end to 0 position
					oSel.moveStart('character', -oField.value.length);
					// Move selection start and end to desired position
					oSel.moveStart('character', iCaretPos);
					oSel.moveEnd('character', 0);
					oSel.select();
				}
				// Firefox support
				else if (oField.selectionStart || oField.selectionStart == '0') {
					oField.selectionStart = iCaretPos;
					oField.selectionEnd = iCaretPos;
					oField.focus();
				}
			}

			function getCaretPosition(DOMElement) {
				DOMElement.createTextRange;
				var position;
				if (document.getSelection) {
				 // Firefox and friends
				 position = DOMElement.selectionEnd;
				} else if (document.selection) {
				 // IE 
				 rg = document.selection.createRange().duplicate();
				 rg.moveStart('textedit', -1);
				 position = rg.text.length;
				}
				
				return position;
			}

			function discardKeyPress(e) {
				if (window.event) {
					window.event.keyCode = 0;
					window.event.returnValue = false;
				} else {
					e.which = 0;
					e.preventDefault();
				}
			}

			function attachOnKeyDownHandler(domElement, e) {
				if (!domElement.KeyHandlersAttached) {
					domElement.KeyHandlersAttached = true;
					domElement.onkeydown = function (e) {
						var keyCode;
						if (window.event)
							keyCode = new Number(parseInt(window.event.keyCode));
						else
							keyCode = new Number(parseInt(e.which));

						if (keyCode == 46 || keyCode == 8) {
							options.specialKey = true;
						}
					}
				}
			}
			
			function getSel(){
				var w=window,d=document,gS='getSelection';
				return (''+(w[gS]?w[gS]():d[gS]?d[gS]():d.selection.createRange().text)).replace(/(^\s+|\s+$)/g,'');
			}
        }
    });
     
})(jQuery);