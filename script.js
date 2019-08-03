/*
	Генерация поля игры
*/

const CELL_BY = '.';
const CELL_HIT = 'Х';
const CELL_EMPTY = ' ';
const LETTER_UP = "АБВГДЕЖЗИК";

function createField() {
	var field = [];
	for (let i = 0; i < 10; i++) {
		field[i] = [];
		for (let j = 0; j < 10; j++) {
			field[i][j] = CELL_EMPTY;
		}	
	}	
	return field;
}

function drawField(field, x, y) { 
	let table = document.createElement("table");
	table.style.position = "absolute";
	table.style.left = x + 'px';
	table.style.top = y + 'px';
	let tr = document.createElement("tr");
	let th = document.createElement("th");
	tr.appendChild(th);
	for (let i = 0; i < 10; i++) {
		th = document.createElement("th");
		let text = document.createTextNode(LETTER_UP.charAt(i));
		th.appendChild(text);
		tr.appendChild(th);
	}
	table.appendChild(tr);
	for (let i = 0; i < 10; i++) {
		tr = document.createElement("tr");
		th = document.createElement("th");
		text = document.createTextNode( i + 1 );
		th.appendChild(text);
		tr.appendChild(th);
		for (let j = 0; j < 10; j++){
			let td = document.createElement("td");
			text = document.createTextNode( field[i][j] );
			td.appendChild(text);
			tr.appendChild(td)
		}		
		table.appendChild(tr);
	}	
	document.body.appendChild(table);
 }
 
var fieldMy = createField(); 
var fieldEnemy = createField();

drawField( fieldMy, 100, 100);
drawField( fieldEnemy, 600, 100);


