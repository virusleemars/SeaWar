/*
	Морской бой
*/

// Расстановку элементов управления переделать
// Добавить графику
// Ручная расстановка кораблей
// + Автоматическая расстановка кораблей
// +Основной цикл игры
// +Проверка попадания по цели
// +Обработка события нажатия на ячейку в таблице
// +Расстановка точек вокруг корабля
// AI
// +Класс корабль
// + Переделать формирование таблицы при каждом рисовании
// +Добавление в список корабль
// +Удаление из списка корабль


const CELL_BY = '.';
const CELL_HIT = 'Х';
const CELL_EMPTY = ' ';
const CELL_SHIP = '#';
const CELL_SHIP_INVISIBLE = CELL_EMPTY;

const LETTER_UP = "АБВГДЕЖЗИК";

const COORD_PLAYER1 = [100, 100];
const COORD_PLAYER2 = [600, 100];

const GAME_STATUS_OVER = 0;
const GAME_STATUS_SET = 1;
const GAME_STATUS_START = 2;

const ARRAY_SHIPS = [ 4, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1];

// Генератор случайных чисел в диапазоне
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
	
class Ship {
	
	constructor (x, y, k, size) {
		this.x = x;
		this.y = y;
		this.k = k;
		this.size = size;
		this.life = size;
	}
	
	// Проверка корабль не уничтожен
	checkLife() {
		return (this.life > 0);
	}
	
	// Проверка точка принадлежит кораблю
	checkPoint(x, y) {		
		if (this.k == 1) {
			if (x >= this.x && x < this.x + this.size && y == this.y) 
				return true;
		}
		else {
			if (y >= this.y && y < this.y + this.size && x == this.x)
				return true;
		}
		return false;
	}
	
	// Убрать жизнь у корабля
	deleteOneLife() {
		this.life--;
	}
}
	
// Основной класс игры
class Game {
	
	constructor () {
		this.game_status = GAME_STATUS_SET;
		this.field_player = new Field("tPlayer", COORD_PLAYER1[0], COORD_PLAYER1[1], true);
		this.field_computer = new Field("tComputer", COORD_PLAYER2[0], COORD_PLAYER2[1], false);	
	}
	
	drawFields() {
		this.field_player.draw();
		this.field_computer.draw();
	}

	clearShips() {
		this.ships_player = [];
		this.ships_computer = [];
	}
	
	clearFields () {
		this.field_player.clear();
		this.field_computer.clear();
		this.clearShips();
	}
	
	// Расстановка кораблей
	setGame() {		
		alert("Расставляйте корабли !!! Пока работает только автоматическая расстановка !!!");
		this.game_status = GAME_STATUS_SET;
		this.clearFields();
		this.clearShips();
		// Нарисовать поля для игры
		this.drawFields();
	}
	
	// Начало игры
	startGame() {
		if (this.game_status != GAME_STATUS_SET)
			return;
		if (this.ships_player.length != ARRAY_SHIPS.length) {
			alert("Не все корабли расставлены");
			return;
		}			 
		// Проверить условия начала игры
		alert("Игра начата. Первый ход игрока");
		// Сгенерировать поле для компа
		this.ships_computer = this.auto(this.field_computer); 		
		this.game_status = GAME_STATUS_START;
	}
	
	stopGame () {
		alert("Игра окончена.");
		this.setGame();
	}
	
	GameOver( winner ) {
		if (winner == 0) 
			alert("Ты победил");
		else
			alert("Ты проиграл");
	}
	
	// Автоматическое заполнение поля игрока
	auto_player () {
		this.field_player.clear();
		this.ships_player = this.auto(this.field_player);			
		this.field_player.draw();
	}
	
	// Автоматическое заполнение поля
	auto(field) {
		let x = 0, y = 0, k = 0;
		let ships = [];
		// Цикл по массиву кораблей
		for (let i = 0; i < ARRAY_SHIPS.length; i++) {
			do { 
				// генерить случайные координаты 
				// x - строка y - столбец k - поворот(0 горизонтально 1 вертикально)
				// при генерации XY учесть размер корабля
				k = getRandomInt(0, 2);
				if (k == 0) {
					x = getRandomInt(0, 10);
					y = getRandomInt(0, 10 - ARRAY_SHIPS[i]);
				}
				else {
					x = getRandomInt(0, 10 - ARRAY_SHIPS[i]);
					y = getRandomInt(0, 10);
				}							
				// Проверить возможность установки
				// Если не получилось повторить 		
			} while ( !field.checkAddShip( x, y, k, ARRAY_SHIPS[i]) );
			// Создать объект корабль
			let s = new Ship(x, y, k, ARRAY_SHIPS[i]);
			// Добавить в список кораблей
			ships.push(s); 	
			// Установить на поле
			field.addShips(x, y, k, ARRAY_SHIPS[i]);
		}	
		return ships;
	}
	
	//
	checkGameOver() {
		if (!this.ships_player.length)
		{
			return 1;
		}	
		if (!this.ships_computer.length)
		{
			return 0;
		}
		return -1;
	}
	
	// Проверить попадание
	checkLuckShot(ships, x, y) {
		let res = -1; 
		for (let i = 0; i < ARRAY_SHIPS.length && res < 0; i++) {
			if ( ships[i] && ships[i].checkPoint(x, y) )
				res = i;
		}
		return res;	
	}
	
	// AI компа 0й уровень
	AI_stupid() {
		let x, y;
		x = getRandomInt(0, 10);
		y = getRandomInt(0, 10);
		return [x, y];
	}
	
	// Обработчик хода игрока
	clickedField (x, y) {
		// Вывести результат выстрела на поле
		this.field_computer.shot(x, y);
		// Проверить попадание в корабль противника
		let index = this.checkLuckShot(this.ships_computer, x, y);
		if (index >= 0) {
			// Убрать жизнь у корабля
			this.ships_computer[index].deleteOneLife();
			// Проверить корабль затонул
			if (!this.ships_computer[index].checkLife()) {
				// Вывести на поле контур корабля			
				this.field_computer.setBY(this.ships_computer[index].x, 
										  this.ships_computer[index].y, 
										  this.ships_computer[index].k, 
										  this.ships_computer[index].size);
				// Если затонул - убрать из массива				
				this.ships_computer.splice(index, 1);				
				// Проверить игра окончена
				let c = this.checkGameOver();
				if (c >= 0) {
					// Если да - выйти
					this.GameOver(c);
					this.stopGame();
					return;
				}
			}		
		}
		// Ход компа
		let crd = this.AI_stupid()
		x = crd[0];
		y = crd[1];
		// Вывести результат выстрела на поле
		this.field_player.shot(x, y);
		// Проверить попадание в корабль противника
		index = this.checkLuckShot(this.ships_player, x, y);
		if (index >= 0) {
			// Убрать жизнь у корабля
			this.ships_player[index].deleteOneLife();
			// Проверить корабль затонул
			if (!this.ships_player[index].checkLife()) {
				// Вывести на поле контур корабля			
				this.field_player.setBY(this.ships_player[index].x, 
										  this.ships_player[index].y, 
										  this.ships_player[index].k, 
										  this.ships_player[index].size);
				// Если затонул - убрать из массива				
				this.ships_player.splice(index, 1);				
				// Проверить игра окончена
				let c = this.checkGameOver();
				if (c >= 0) {
					// Если да - выйти
					this.GameOver(c);
					this.stopGame();
					return;
				}
			}		
		}		
		
		this.drawFields();
	}
}

// Функция движение мыши
function mouseoverCell (event) {
	let target = event.target;
	target.style.background = 'silver';
}

function mouseoutCell (event) {
	let target = event.target;
	target.style.background = 'white';
}

// Функция обработки нажатия на ячейку в таблице
function clickCell() {
	game.clickedField(this.id[0], this.id[1])
}

// Класс поле
class Field {
	
	constructor(id, x, y, human) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.f = this.createField();
		this.human = human;
		this.createTableHtml();		
	}
	
	draw () {		
		for (let i = 0; i < 10; i++)
			for (let j = 0; j < 10; j++) {
				let elem = document.getElementById( String(i) + String(j) + this.id );
				if (elem) 
					// Если таблица компа и клетка корабль - не рисовать
					if (this.f[i][j] == CELL_SHIP && !this.human)
						continue;
					else
						elem.innerHTML = this.f[i][j];
			}
	}
	
	shot(x, y) {
		if (this.f[x][y] == CELL_SHIP)
			this.f[x][y] = CELL_HIT;
		else	
			if (this.f[x][y] != CELL_HIT)
				this.f[x][y] = CELL_BY;
	}
	
	createField() {
		var field = [];
		for (let i = 0; i < 10; i++) {
			field[i] = [];
			for (let j = 0; j < 10; j++) {
				field[i][j] = CELL_EMPTY;
			}	
		}		
		return field;
	}
	
	// Проставить мимо вокруг корабля
	setBY(x, y, k, size) {
		let x1, x2, y1, y2;
		// Проверить на пересечение и соприкосновение
		// Вычислить координаты прямоуголника
		// Если у верхней границы, то совпадает с началом корабля иначе выше
		x1 = (x == 0) ? x : x - 1;
		// Если у левой границы, то совпадает с началом корабля иначе левее
		y1 = (y == 0) ? y : y - 1;
		// Если горизонтально
		if (k == 0) {			
			// Если у нижней границы
			x2 = (x == 9) ?  x + 1 : x + 2;
			// Если у правой границы
			y2 = (y + size == 10) ?  y + size : y + size + 1;
		}
		else { // вертикально
			// Если у правой границы
			x2 = (x + size == 10) ?  x + size : x + size + 1;
			// Если у нижней границы
			y2 = (y == 9) ?  y + 1 : y + 2;			
		}	
		// Сканируем прямоугольник на попадание кораблей
		for ( let i = x1; i < x2; i++)
			for ( let j = y1; j < y2; j++)
			 if (this.f[i][j] != CELL_HIT)
				this.f[i][j] = CELL_BY;		 	 	
	}
	
	addShips(x, y, k, size) {
		// Добавить корабль на поле
		for (let i = 0; i < size; i++) {
			// Если горизонтально
			if (k == 0) {		
				this.f[x][y + i] = CELL_SHIP;}
			else { // Если вертикально 				
				this.f[x + i][y] = CELL_SHIP;}
		}			
	}
	
	// Проверить установку корабля
	checkAddShip(x, y, k, size) {
		let x1, x2, y1, y2;
		// Проверить на пересечение и соприкосновение
		// Вычислить координаты прямоуголника
		// Если у верхней границы, то совпадает с началом корабля иначе выше
		x1 = (x == 0) ? x : x - 1;
		// Если у левой границы, то совпадает с началом корабля иначе левее
		y1 = (y == 0) ? y : y - 1;
		// Если горизонтально
		if (k == 0) {			
			// Если у нижней границы
			x2 = (x == 9) ?  x + 1 : x + 2;
			// Если у правой границы
			y2 = (y + size == 10) ?  y + size : y + size + 1;
		}
		else { // вертикально
			// Если у правой границы
			x2 = (x + size == 10) ?  x + size : x + size + 1;
			// Если у нижней границы
			y2 = (y == 9) ?  y + 1 : y + 2;			
		}	
		// Сканируем прямоугольник на попадание кораблей
		for ( let i = x1; i < x2; i++)
			for ( let j = y1; j < y2; j++)
			 if (this.f[i][j] != CELL_EMPTY)
				return false;		 	 	
		return true;
	}
	
	addShips(x, y, k, size) {
		// Добавить корабль на поле
		for (let i = 0; i < size; i++) {
			// Если горизонтально
			if (k == 0) {		
				this.f[x][y + i] = CELL_SHIP;}
			else { // Если вертикально 				
				this.f[x + i][y] = CELL_SHIP;}
		}		
	}
	
	createTableHtml() { 
		let table = document.getElementById(this.id);
		if (table) table.remove();
		// Создать таблицу
		table = document.createElement("table");
		table.setAttribute( "id", this.id);
		// Разместить таблицу на странице
		table.style.position = "absolute";
		table.style.left = this.x + 'px';
		table.style.top = this.y + 'px';
		// Заполнить верхнюю строку буквами
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
		// Отрисовка клеток таблицы
		for (let i = 0; i < 10; i++) {
			tr = document.createElement("tr");
			th = document.createElement("th");
			let text = document.createTextNode( i + 1 );
			th.appendChild(text);
			tr.appendChild(th);
			for (let j = 0; j < 10; j++){
				let td = document.createElement("td");
				text = document.createTextNode(" ");
				td.appendChild(text);					
				if (!this.human) {
					
					td.onclick = clickCell;
					td.onmouseover = mouseoverCell;
					td.onmouseout = mouseoutCell; 
				}	
				td.setAttribute( "id", String(i) + String(j) + this.id);		
				tr.appendChild(td)
			}		
			table.appendChild(tr);
		}	
		document.body.appendChild(table);
	 }
	 
	clear() {
		 for (let i = 0; i < 10; i++) 
			for (let j = 0; j < 10; j++) 
				this.f[i][j] = CELL_EMPTY;
	 }
}

// Установка событий на элементы управления
function setupEvent() {
		// кнопка начала игры
		let button = document.getElementById('buttonNewGame');
		if (button) {
			button.onclick = function() {				
				game.startGame();
				// Сделать недоступными кнопки
				
			}
		}
		
		// кнопка сброса игры
		button = document.getElementById('buttonStopGame');
		if (button) {
			button.onclick = function() {				
				game.stopGame();
				// Сделать доступными кнопки
			}
		}
		
		// кнопка автоматической расстановки
		button = document.getElementById('buttonAuto');
		if (button) {
			button.onclick = function() {
				game.auto_player();
			}
		}
		
		// Кнопка очистки поля
		button = document.getElementById('buttonClear');
		if (button) {
			button.onclick = function() {
				game.clearFields();
				game.drawFields();
			}
		}
		
		button = document.getElementById('buttonRotate');
		if (button) {
			button.disabled = true;
		}
		
		button = document.getElementById('setship4');
		if (button) {
			button.disabled = true;
		}
		
		button = document.getElementById('setship3');
		if (button) {
			button.disabled = true;
		}
		
		button = document.getElementById('setship2');
		if (button) {
			button.disabled = true;
		}
		
		button = document.getElementById('setship1');
		if (button) {
			button.disabled = true;
		}
}		

// Создать основной объект 
var game = new Game();
// Установить обработчики на кнопки
setupEvent();
// Этап расстановки кораблей
game.setGame();