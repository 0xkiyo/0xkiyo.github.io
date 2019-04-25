var term=new Array();

var helpPage=[
	'%CS%+r Terminal Help %-r%n',
	' This is just a tiny test for multiple terminals.',
	' use one of the following commands:',
	'     ls .... lists the contents',
	'     cat .... it reads data from files, and outputs their contents.',
	'     cd .... used to change the current working directory',
	'     clear .... clear the terminal',
	'     help ..... show this help page'
];

var presentation = " Let me introduce myself: I am Kiyoshi Omaza and I love learning technologies related to the field of development every day. Working on small projects helps me to grow professionally and not to lose the motivation in this wonderful world. Currently I am studying Mathematics and computer science at the Universidad Politecnica de Madrid, working primarily with languages such as Java, C, Bash and Haskell. To get to know me a little bit more, select one of the available options.";

var mainContent=' experience/     education/     projects/     presentation.txt     contact.txt';

var expContent=[
	' ../     ey.txt     ineco.txt     teaching.txt'
];
var eduContent=[
	' ../     university.txt'
];
var projContent=[
	' ../     present.txt     future.txt'
];

function termOpen(n) {
	if (!term[n]) {
		var y=(n==1)? 70: 280;
		var d = new Date();

		var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		var txt = "%+r Last login: " + weekday[d.getDay()] + " " + months[d.getMonth()] + " " + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " on console %-r\n";

		var dimCols;
		if ($("#particles-js").innerWidth() < 600) {
			dimCols = 40;
		}
		else {
			dimCols = 100;
		}
		term[n]=new Terminal(
			{
				cols: dimCols,
				rows: 20,
				greeting: txt,
				ps: ' kiyoshiomaza $',
				id: n,
				termDiv: 'termDiv'+n,
				frameColor: '#aaaaaa',
				bgColor: '#000000',
				crsrBlinkMode: true,
				handler: termHandler
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
		else if (cmd=='ls') {
			if (this.ps == ' kiyoshiomaza/experience $') {
				this.write(expContent);
			}
			else if (this.ps == ' kiyoshiomaza/education $') {
				this.write(eduContent);
			}
			else if (this.ps == ' kiyoshiomaza/projects $') {
				this.write(projContent);
			}
			else {
				this.write(mainContent);
			}
		}
		else if (cmd=='cat presentation.txt' && this.ps == ' kiyoshiomaza $') {
			this.write(presentation);
		}
		else if (cmd=='cd ..') {
			if (this.ps != ' kiyoshiomaza $') {
				this.ps = ' kiyoshiomaza $';
			}
		}
		else if (cmd=='cd') {
			this.ps = ' kiyoshiomaza $';
		}
		else if (cmd=='cd experience') {
			this.ps = ' kiyoshiomaza/experience $';
		}
		else if (cmd=='cd education') {
			this.ps = ' kiyoshiomaza/education $';
		}
		else if (cmd=='cd projects') {
			this.ps = ' kiyoshiomaza/projects $';
		}
		else if (cmd=='help') {
			this.write(helpPage);
		}
	}
	this.prompt();
}

function termExitHandler() {
	var other=(this.id==1)? 2:1;
	if ((term[other]) && (term[other].closed==false)) term[other].focus();
}
