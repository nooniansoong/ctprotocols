// ORIGINAL
// var options = {
// 	valueNames: ['protNum', 'protDesc', 'protIndic', 'protMDCT']
// };

// var protocolList = new List('protocolDIV', options);

// STUFF THAT WORKS

var options = {
	valueNames: ['protNum', 'protDesc', 'protIndic', 'protMDCT']
};

// var values = [
// 	{protNum: '285', protDesc: 'Stockholm', protIndic: 'indication', protMDCT: 'MDCT protocol'}
// ];

var protocolList = new List('protocolDIV', options);
protocolList.remove({protNum: '0'});

// protocolList.add({
// 	protNum: '284',
// 	protDesc: 'descrip',
// 	protIndic: 'indication',
// 	protMDCT: 'mdct protocol'
// });

// protocolList.add(values);

// CSV STUFF

var CSVProtocols = new XMLHttpRequest();
CSVProtocols.open('GET', 'ctprotocols.csv', true);
CSVProtocols.send();
var CSVText = '', CSVLines = [];

		CSVLines = CSVProtocols.responseText.split('\n');
		parseCSV();
		addProtocols();

CSVProtocols.onreadystatechange = function() {
	if (CSVProtocols.readyState == 4) {	// have to wait for AJAX call to complete
		CSVLines = CSVProtocols.responseText.split('\n');
		parseCSV();
		addProtocols();
	}
};

function addProtocols() {
	var i, len;
	for (i = 1, len = CSVLines.length; i < len; i++) {
		protocolList.add({
			protNum: CSVLines[i][0],
			protDesc: CSVLines[i][1],
			protIndic: CSVLines[i][2],
			protMDCT: CSVLines[i][3]
		});
	}
}

function parseCSV() {
	var i, len;
	for (i = 0, len = CSVLines.length; i < len; i++) {
		CSVLines[i] = CSV.parse(CSVLines[i]);
	}
}

function CSVtoArray(text) {
	var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
	var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
	// Return NULL if input string is not well formed CSV string.
	if (!re_valid.test(text)) return null;
	var a = [];	// Initialize array to receive values.
	text.replace(re_value,	// "Walk" the string using replace with callback.
		function(m0, m1, m2, m3) {
			// Remove backslash from \' in single quoted values.
			if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
			// Remove backslash from \" in double quoted values.
			else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
			else if (m3 !== undefined) a.push(m3);
			return '';	// Return empty string.
		});
	// Handle special case of empty last value.
	if (/,\s*$/.test(text)) a.push('');
	return a;
}


var CSV = {
parse: function(csv, reviver) {
    reviver = reviver || function(r, c, v) { return v; };
    var chars = csv.split(''), c = 0, cc = chars.length, start, end, table = [], row;
    while (c < cc) {
        table.push(row = []);
        while (c < cc && '\r' !== chars[c] && '\n' !== chars[c]) {
            start = end = c;
            if ('"' === chars[c]){
                start = end = ++c;
                while (c < cc) {
                    if ('"' === chars[c]) {
                        if ('"' !== chars[c+1]) { break; }
                        else { chars[++c] = ''; } // unescape ""
                    }
                    end = ++c;
                }
                if ('"' === chars[c]) { ++c; }
                while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) { ++c; }
            } else {
                while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) { end = ++c; }
            }
            row.push(reviver(table.length-1, row.length, chars.slice(start, end).join('')));
            if (',' === chars[c]) { ++c; }
        }
        if ('\r' === chars[c]) { ++c; }
        if ('\n' === chars[c]) { ++c; }
    }
    return table;
},

stringify: function(table, replacer) {
    replacer = replacer || function(r, c, v) { return v; };
    var csv = '', c, cc, r, rr = table.length, cell;
    for (r = 0; r < rr; ++r) {
        if (r) { csv += '\r\n'; }
        for (c = 0, cc = table[r].length; c < cc; ++c) {
            if (c) { csv += ','; }
            cell = replacer(r, c, table[r][c]);
            if (/[,\r\n"]/.test(cell)) { cell = '"' + cell.replace(/"/g, '""') + '"'; }
            csv += (cell || 0 === cell) ? cell : '';
        }
    }
    return csv;
}
};
