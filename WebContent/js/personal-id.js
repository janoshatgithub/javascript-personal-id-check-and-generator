/*!
 * Personal id JavaScript Library
 *
 * Created by Jan Schroeder Hansen
 *
 */
function calculateModules11(id, to) {
	var multiply = [4, 3, 2, 7, 6, 5, 4, 3, 2, 1];
	var sum = 0;
	var pos = 0;
	var i;
	for (i = 0; i < to; i++) {
		var x = id.substring(pos, pos + 1);
		var intValue = parseInt(x, 10);
		sum += intValue * multiply[i];
		if (i === 5) {
			pos++; //Ignore dash
		}
		pos++;
	}
	return sum;
}

function calculateSECheckSum(id) {
	var sum = 0;
	var pos;
	for (pos = 0; pos < 10; pos++) {
		switch (pos) {
			case 0:
			case 2:
			case 4:
			case 7:
			case 9:
				var intValue = 2 * parseInt(id.substring(pos, pos + 1), 10);
				if (intValue > 9) {
					intValue = 1 + (intValue - 10);
				}
				sum += intValue;
				break;
			case 6: //Ignore dash
				break;
			default:
				sum += parseInt(id.substring(pos, pos + 1), 10);
				break;
		}
	}
    var checksum = 10 - (sum % 10);
    if (checksum === 10) {
		checksum = 0;
	}
	return checksum;
}

function TestDKPersonalId(id) {
	this.id = id;
	
	this.getResultAsHtml = function() {
		var returnHtml = "";
		var errorFound = false;
		if (!this.formatValidation()) {
			errorFound = true;
			returnHtml += "<li>Format fejl: DDMMYY-XXXY</li>";
			returnHtml += "<ul>";
			returnHtml += "<li>DDMMYY = f�dselsdag</li>";
			returnHtml += "<li>XXX = l�benummer m.m.</li>";
			returnHtml += "<li>Y = modulus 11 check.</li>";
			returnHtml += "</ul>";
		}
		else {
			if (!this.modulus11Validation()) {
				errorFound = true;
				returnHtml += "<li>Modulus 11 fejl</li>";
			}
			var birhtdate = this.getBirthDate();
			if (birhtdate === null) {
				errorFound = true;
				returnHtml += "<li>Ikke gyldig f�dselsdag</li>";
			}
		}
		if (errorFound) {
			return "F�lgende fejl er fundet:<br /><ul>" + returnHtml + "</ul>";
		}
		else {
			var okReturnHtml = "";
			okReturnHtml += "<b>Ok!</b><br/>";
			okReturnHtml += "<ul>";
			okReturnHtml += "<li>F�dt: " + this.getBirthDate().toLocaleDateString() + "</li>";
			var gender = this.getGender();
			if (gender === "MALE") {
				okReturnHtml += "<li>K�n: Mand</li>";
			}
			else {
				okReturnHtml += "<li>K�n: Kvinde</li>";
			}
			if (this.noModulus11Validation()) {
				okReturnHtml += "<li>Modulus 11 kontrol, kan ikke benyttes for denne f�dselsdag.</li>";
			}
			okReturnHtml += "</ul>";
			return okReturnHtml;
		}
	};
	
	this.formatValidation = function() {
		var re = new RegExp("^(((0|1|2)[0-9])|(3[0-1]))((0[1-9])|(1[0-2]))[0-9]{2}-[0-9]{4}$");
		if (id.match(re)) {
			return true;
		}
		else {
			return false;
		}
	};
	
	this.modulus11Validation = function() {
		var modulus11Ok = false;
		if (id.length === 11) {
			if (this.noModulus11Validation()) {
				return true;
			}
			else {
				var sum = calculateModules11(id, 10);
	            if (sum % 11 === 0) {
					modulus11Ok = true;
	            }
			}
		}
		return modulus11Ok;
	};
	
	this.noModulus11Validation = function() {
		var birthdate = this.getBirthDate();
		var gender = this.getGender();
		if (birthdate !== null) {
			var noModulusOn01011965 = $.datepicker.parseDate('ddmmyy', '01011965'); 
			if (birthdate.getTime() === noModulusOn01011965.getTime() && gender === "MALE") {
				return true;
			}
			var noModulusOn01011966 = $.datepicker.parseDate('ddmmyy', '01011966'); 
			if (birthdate.getTime() === noModulusOn01011966.getTime() && gender === "MALE") {
				return true;
			}
		}
		return false;
	};
	
	this.getFullYear = function() {
		var year = parseInt(id.substring(4, 6), 10);
		var digit8 = parseInt(id.substring(7, 8), 10);
		var fullYear = 0;
        switch (digit8) {
            case 0:
            case 1:
            case 2:
            case 3:
                fullYear = 1900 + year;                       
                break;
            case 4:
                if (year < 37) {
                    fullYear = 2000 + year;
                }
                else {
                    fullYear = 1900 + year;
                }
                break;
            case 5:
            case 6:
            case 7:
            case 8:
                if (year > 57) {
                    fullYear = 1800 + year;
                }
                else {
                    fullYear = 2000 + year;
                }
                break;
            case 9:
                if (year > 36) {
                    fullYear = 1900 + year;
                }
                else {
                    fullYear = 2000 + year;
                }
                break;
        }
        return fullYear;
	};
	
	this.getBirthDate = function() {
		var str = id.substring(0, 4) + this.getFullYear();
		try {
			return $.datepicker.parseDate('ddmmyy', str);
		}
		catch (er) {
			return null;
		}
	};
	
	this.getGender = function() {
		var digit11 = parseInt(id.substring(10, 11), 10);
		var x = digit11 % 2;
		if (x === 0) {
			return "FEMALE";
		}
		else {
			return "MALE";
		}
	};
}

function GenerateDKPersonalIds(gender, birthdate) {
	this.gender = gender;
	this.birthdate = birthdate;
	
	this.getResultAsHtml = function() {
		return this.generate();
	};
	
	this.generate = function() {
		var fixpart = "";
		var day = birthdate.getDate();
		if (day < 10) {
			fixpart += "0";
		}
		fixpart += day;
		var month = birthdate.getMonth() + 1;
		if (month < 10) {
			fixpart += "0";
		}
		fixpart += month;
		var fullYear = birthdate.getFullYear().toString();
		var strYear = fullYear;
		fixpart += strYear.substring(2, 4);
		fixpart += "-"; 
		
		var result = "";
		var valid8Digits = this.getValid8Digits(fullYear);
		var counter = 0;
		var next8Digit;
		var nextSerialNumber;
		for(next8Digit = 0; next8Digit < valid8Digits.length; next8Digit++) {
			for (nextSerialNumber = 0; nextSerialNumber <= 99; nextSerialNumber++) {
				var nextId = fixpart;
				nextId += valid8Digits[next8Digit];
				if (nextSerialNumber < 10) {
					nextId += "0";
				}
				nextId += nextSerialNumber;
				var sum = calculateModules11(nextId, 9);
	            var remainder = sum % 11;
	            var modulus11 = 0;
	            if (remainder !== 0) {
					modulus11 = 11 - remainder;
				}
				if (modulus11 < 10) {
					nextId += modulus11;
					if (modulus11 % 2 === 0 && gender === "FEMALE") {
						if (counter > 0) {
							result += ", ";
						}
						result += "<nobr>" + nextId + "</nobr>";
						counter++;
					}
					else if (modulus11 % 2 !== 0 && gender === "MALE") {
						if (counter > 0) {
							result += ", ";
						}
						result += "<nobr>" + nextId + "</nobr>";
						counter++;
					}
				}
			}
		}
		result += "<br /><br /><b>Antal: " + counter + "</b>";
		return result;
	};
	
	this.getValid8Digits = function(fullYear) {
		var century = Math.floor(fullYear / 100);
		var year = fullYear % 100;
		var valid8Digits = [];
		var nextElement = 0;

        if (century === 19) {
            valid8Digits[nextElement++] = 0;
            valid8Digits[nextElement++] = 1;
            valid8Digits[nextElement++] = 2;
            valid8Digits[nextElement++] = 3;
            if (year >= 37)
            {
				valid8Digits[nextElement++] = 4;
				valid8Digits[nextElement++] = 9;
            }
        }
        else if (century === 20) {
            if (year < 37) {
				valid8Digits[nextElement++] = 4;
            }
            if (year <= 57) {
				valid8Digits[nextElement++] = 5;
				valid8Digits[nextElement++] = 6;
				valid8Digits[nextElement++] = 7;
				valid8Digits[nextElement++] = 8;
            }
            if (year <= 36) {
				valid8Digits[nextElement++] = 9;
			}
        }
        else if (century === 18) {
            if (year > 57) {
				valid8Digits[nextElement++] = 5;
				valid8Digits[nextElement++] = 6;
				valid8Digits[nextElement++] = 7;
				valid8Digits[nextElement++] = 8;
            }
        }
        return valid8Digits;
	};
}

function TestSEPersonalId(id) {
	this.id = id;
	
	this.getResultAsHtml = function() {
		var returnHtml = "";
		var errorsFound = false;
		if (!this.formatValidation()) {
			errorsFound = true;
			returnHtml += "<li>Format fejl: DDMMYY-XXXY</li>";
			returnHtml += "<ul>";
			returnHtml += "<li>-/+ Hvis personen er over 100 �r gammel, s� benyttes der et \"+\" ellers benyttes \"-\"</li>";
			returnHtml += "<li>DDMMYY = f�dselsdag</li>";
			returnHtml += "<li>XXX = l�benummer m.m.</li>";
			returnHtml += "<li>Y = Tjeksum.</li>";
			returnHtml += "</ul>";
		}
		else {
			if (!this.checksumValidation()) {
				errorsFound = true;
				returnHtml += "<li>Checksum fejl</li>";
			}
			var birhtdate = this.getBirthDate();
			if (birhtdate === null) {
				errorsFound = true;
				returnHtml += "<li>Ikke gyldig f�dselsdag</li>";
			}
		}
		if (errorsFound) {
			return "F�lgende fejl er fundet:<br /><ul>" + returnHtml + "</ul>";
		}
		else {
			var okReturnHtml = "";
			okReturnHtml += "<b>Ok!</b><br/>";
			okReturnHtml += "<ul>";
			okReturnHtml += "<li>F�dt: " + this.getBirthDate().toLocaleDateString() + "</li>";
			var gender = this.getGender();
			if (gender === "MALE") {
				okReturnHtml += "<li>K�n: Mand</li>";
			}
			else {
				okReturnHtml += "<li>K�n: Kvinde</li>";
			}
			okReturnHtml += "</ul>";
			return okReturnHtml;
		}
	};
	
	this.formatValidation = function() {
		var re = new RegExp("^(((0|1|2)[0-9])|(3[0-1]))((0[1-9])|(1[0-2]))[0-9]{2}(-|\\+){1}[0-9]{4}$");
		if (id.match(re)) {
			return true;
		}
		else {
			return false;
		}
	};
	
	this.checksumValidation = function() {
		var checksumOk = false;
		if (id.length === 11) {
			var calcCheckSum = calculateSECheckSum(id);
			var checkSum = parseInt(id.substring(10, 11), 10);
            if (calcCheckSum === checkSum) {
				checksumOk = true;
            }
		}
		return checksumOk;
	};	
	
	this.getBirthDate = function() {
		var str = id.substring(0, 4) + this.getFullYear();
		try {
			return $.datepicker.parseDate('ddmmyy', str);
		}
		catch (er) {
			return null;
		}
	};

	this.getFullYear = function() {
		var now = new Date();
		var year = now.getFullYear();
        var firstPart = Math.floor(year / 100); 
        var secondPart = year - firstPart * 100;
        var yearPartFromPersonalIdentityNumber = parseInt(id.substring(4, 6), 10);
        var dash = id.substring(6, 7);
        if (yearPartFromPersonalIdentityNumber <= secondPart) {
            if (dash === '+') { //Person over 100 years old
                firstPart--;
            }                
        }
        else {
            if (dash === '+') { //Person over 100 years old
                firstPart = firstPart - 2;
            }
            else {
                firstPart--;
            }
        }
        return (firstPart * 100) + yearPartFromPersonalIdentityNumber;
	};
	
	this.getGender = function() {
		var digit10 = parseInt(id.substring(9, 10), 10);
		var x = digit10 % 2;
		if (x === 0) {
			return "FEMALE";
		}
		else {
			return "MALE";
		}
	};
}

function GenerateSEPersonalIds(gender, birthdate) {
	this.gender = gender;
	this.birthdate = birthdate;
	
	this.getResultAsHtml = function() {
		return this.generate();
	};
	
	this.generate = function() {
		var now = new Date();
		var year = now.getFullYear();
		var age = year - birthdate.getFullYear();
		if (age > 199) {
			return "Alder over 199!";
		}
		var fixpart = "";
		var day = birthdate.getDate();
		if (day < 10) {
			fixpart += "0";
		}
		fixpart += day;
		var month = birthdate.getMonth() + 1;
		if (month < 10) {
			fixpart += "0";
		}
		fixpart += month;
		var fullYear = birthdate.getFullYear().toString();
		var strYear = fullYear;
		fixpart += strYear.substring(2, 4);
		if (age < 100) {
			fixpart += "-";
		}
		else {
			fixpart += "+";
		}
		var result = "";
        var startFrom = 0;
        if (gender === "MALE") {
            startFrom = 1;
        }
        var counter = 0;
		var i;
        for (i = startFrom; i < 1000; i = i + 2) {
			var nextId = fixpart;
            if (i < 100) {
				nextId += "0";
			}
            if (i < 10) {
				nextId += "0";
			}
            nextId += i;
            nextId += calculateSECheckSum(nextId);
			if (counter > 0) {
				result += ", ";
			}
			result += "<nobr>" + nextId + "</nobr>";
			counter++;
        }
        result += "<br /><br /><b>Antal: " + counter + "</b>";
		return result;
	};
}


function testPersonalId(id, country) {
	switch (country) {
		case "dk":
			var dkTester = new TestDKPersonalId(id);
			return dkTester.getResultAsHtml();
		case "se":
			return "Virker pt. ikke.";
			var seTester = new TestSEPersonalId(id);
			//return seTester.getResultAsHtml();
		default:
			return "Kun danske og svenske person id'er kan testes.";
	}
}

function generatePersonalIds(country, gender, birthdate) {
	switch (country) {
	case "dk":
		var dkGenerator = new GenerateDKPersonalIds(gender, birthdate);
		return dkGenerator.getResultAsHtml();
	case "se":
		return "Virker pt. ikke.";	
		//var seGenerator = new GenerateSEPersonalIds(gender, birthdate);
		//return seGenerator.getResultAsHtml();
	default:
		return "Kun danske og svenske person id'er kan genereres.";
	}
}