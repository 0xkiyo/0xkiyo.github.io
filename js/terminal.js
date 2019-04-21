var term=new Array();

var helpPage=[
	'%CS%+r Terminal Help %-r%n',
	'  This is just a tiny test for multiple terminals.',
	'  use one of the following commands:',
	'     clear .... clear the terminal',
	'     exit ..... close the terminal (or <ESC>)',
	'     id ....... show terminal\'s id',
	'     switch ... switch to other terminal',
	'     help ..... show this help page',
	'  other input will be echoed to the terminal.',
	' '
];

function termOpen(n) {
	if (!term[n]) {
		var y=(n==1)? 70: 280;
		var d = new Date();

		var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		var txt = "%+r Last login: " + weekday[d.getDay()] + " " + months[d.getMonth()] + " " + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " on console %-r\n";

		var dimCols;
		if ($("#particles-js").innerWidth() < 609) {
			dimCols = 50;
		}
		else {
			dimCols = 140;
		}

		term[n]=new Terminal(
			{
				cols: dimCols,
				rows: 20,
				greeting: txt,
				ps:'kiyoshiomaza $',
				id: n,
				termDiv: 'termDiv'+n,
				frameColor: '#aaaaaa',
				bgColor: '#000000',
				crsrBlinkMode: true,
				handler: termHandler,
				exitHandler: termExitHandler
			}
		);
		if (term[n]) term[n].open();
	}
	else if (term[n].closed) {
		term[n].open();
	}
	else {
		term[n].focus();
	}

	
}

function termHandler() {
	this.newLine();
	var cmd=this.lineBuffer;
	if (cmd!='') {
		if (cmd=='clear') {
			this.clear();
		}
		else if (cmd=='exit') {
			this.close();
		}
		else if (cmd=='help') {
			this.write(helpPage);
		}
		else if (cmd=='id') {
			this.write('terminal id: '+this.id);
		}
		else {
			this.type('You typed: '+cmd);
			this.newLine();
		}
	}
	this.prompt();
}

function termExitHandler() {
	var other=(this.id==1)? 2:1;
	if ((term[other]) && (term[other].closed==false)) term[other].focus();
}
