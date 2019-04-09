
var term = new Array();

function termOpen(n) {

	if (termToSet) return;
	n = parseInt(n);
	if ((!n) || (isNaN(n))) n = 1;
	var termid = 'terminal'+n;

	var d = new Date();

	var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	var txt = "%+r Last login: " + weekday[d.getDay()] + " " + months[d.getMonth()] + " " + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " on console %-r";
	//if (!term[n]) {
		term[n] = new Terminal(
			{
				cols:86,
				rows:30,
				x: 0,
				y: 0,
				id: n,
				termDiv: 'termDiv'+n,
				ps:'kiyoshiomaza $',
				frameWidth: 1,
				frameColor: '#aaaaaa',
				bgColor: '#FFFFFF',
				greeting: txt,
				handler: termHandler,
				exitHandler: termChromeHide
			}
		);
		term[n].colorsetting=1;
		if (term[n]) {
			termChromeShow(n);
			term[n].open();
		}
	//}
	//else if (term[n].closed) {
	//	termSetChromeState(n, true);
	//	termChromeShow(n);
	//	term[n].open();
	//}
	//else {
	//	termSetChromeState(n, true);
	//}
	termBringToFront(n);
}

function termHandler() {
	this.newLine();
	var line = this.lineBuffer;
	if (line != '') {
		if (line == 'exit') this.close()
		else this.type('You typed: '+line);
	}
	this.prompt();
}

function termSetChromeState(n, v) {
	var header = 'termHeader'+n;
	var classname = (v)? 'termHeaderActive':'termHeaderInactive';
	if (document.getElementById) {
		var obj = document.getElementById(header);
		if (obj) obj.className = classname;
	}
	else if (document.all) {
		var obj = document.all[header];
		if (obj) obj.className = classname;
	}
	
}

function termChromeShow(n) {
	var div = 'terminal'+n;
	TermGlobals.setElementXY(div, 210+n*20, 30+n*20);
	TermGlobals.setVisible(div,1);
	if (document.getElementById) {
		var obj = document.getElementById(div);
		if (obj) obj.className = 'termShow';
	}
	else if (document.all) {
		var obj = document.all[div];
		if (obj) obj.className = 'termShow';
	}
}

function termChromeHide() {
	document.getElementById("introduction").hidden = false;
	document.getElementById("presentation").hidden = false;
	document.getElementById("modes").hidden = false;
	document.getElementById("bg-main").style.backgroundColor = "white";
	document.getElementById("bg-main").style.border = "double";


	var div='terminal'+this.id;
	TermGlobals.setVisible(div,0);
	if (document.getElementById) {
		var obj = document.getElementById(div);
		if (obj) obj.className = 'termHidden';
	}
	else if (document.all) {
		var obj = document.all[div];
		if (obj) obj.className = 'termHidden';
	}
	if (termToSet==this.id) closeSettings(0);
}

function termClose(n) {
	if ((term[n]) && (term[n].closed == false)) term[n].close();
}

function termBringToFront(n) {
	for (var i=1; i<term.length; i++) {
		if ((n!=i) && (term[i])) {
			var obj=(document.getElementById)? document.getElementById('terminal'+i):document.all['terminal'+i];
			if (obj) obj.style.zIndex=1;
			termSetChromeState(i, false);
		}
	}
	var obj=(document.getElementById)? document.getElementById('terminal'+n):document.all['terminal'+n];
	if (obj) obj.style.zIndex=2;
	termSetChromeState(n, true);
	term[n].focus();
}

var termToSet=0;

function termConfigure(n) {
	var t=term[n];
	if (parseFloat(t.version)<1.03) {
		alert('This utility requires termlib.js 1.03 or better.');
		return;
	}
	var color = t.colorsetting;
	termToSet = n;
	var f=document.forms.settingvalues;
	f.rows.value=t.conf.rows;
	f.cols.value=t.conf.cols;
	f.color[color-1].checked=true;
	var div='settingsdialog';
	TermGlobals.setVisible(div,1);
	if (document.getElementById) {
		var obj = document.getElementById(div);
		if (obj) obj.className = 'termShow';
	}
	else if (document.all) {
		var obj = document.all[div];
		if (obj) obj.className = 'termShow';
	}
	var td='terminal'+n;
	objs = (document.getElementById)? document.getElementById(td):document.all[td];
	if (obj) TermGlobals.setElementXY(div, parseInt(objs.style.left)+26, parseInt(objs.style.top)+26);
	TermGlobals.keylock=true;
}

function closeSettings(state) {
	var t=term[termToSet];
	if (state) {
		var f=document.forms.settingvalues;
		var color = 1
		if (f.color[1].checked) color=2
		else if (f.color[2].checked) color=3
		else if (f.color[3].checked) color=4;
		var rows = parseInt(f.rows.value);
		var cols = parseInt(f.cols.value);
		if ((isNaN(rows)) || (rows<2) || (isNaN(cols)) || (cols<4)) {
			rows=t.conf.rows;
			cols=t.conf.cols;
		}
		var changed=((rows==t.conf.rows) && (cols==t.conf.cols) && (color==t.colorsetting))? false:true;
		t.colorsetting=color;
		var rstring= 'New Settings: Terminal set to '+rows+' rows, '+cols+' cols, ';
		if (color==1) {
			t.conf.bgColor='#eeeeee';
			t.conf.fontClass='term';
			rstring+='black on white.';
		}
		else if (color==2) {
			t.conf.bgColor='#181818';
			t.conf.fontClass='term2';
			rstring+='white on black.';
		}
		else if (color==3) {
			t.conf.bgColor='#181818';
			t.conf.fontClass='term3';
			rstring+='green on black.';
		}
		else if (color==4) {
			t.conf.bgColor='#779977';
			t.conf.fontClass='term4';
			rstring+='black on green.';
		}
		if (changed) {
			t.cursorOff();
			t.conf.rows=t.maxLines=rows;
			t.conf.cols=t.maxCols=cols;
			t.rebuild();
			t.newLine();
			t.write(rstring);
			t.prompt();
		}
	}
	var div='settingsdialog';
	TermGlobals.setVisible(div,0);
	if (document.getElementById) {
		var obj = document.getElementById(div);
		if (obj) obj.className = 'termHidden';
	}
	else if (document.all) {
		var obj = document.all[div];
		if (obj) obj.className = 'termHidden';
	}
	termToSet = 0;
	TermGlobals.keylock=false;
}

function settingsSetColor(n) {
	document.forms.settingvalues.elements.color[n-1].checked=true;
}
