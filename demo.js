var startBtn = document.getElementById('btn');
var map = document.getElementById('map');
var gameOver = document.getElementById('alert-box');
var alertPic = document.getElementById('alert-pic');
var close = document.getElementById('close');
var score = document.getElementById('score');
// 雷的总数
var leiNum = 10;
var startGame = true;

startClick();
// 开始游戏，初始化地图
function startClick() {
	startBtn.onclick = function () {
		if (startGame) {
			leiNum = 10;
			map.innerHTML = '';
			score.innerHTML = leiNum;
			mapInit();
			map.style.display = "block";
			map.oncontextmenu = function () {
				return false;
			}
			//鼠标左右键事件初始化
			leftClickInit();
			rightClickInit();
			close.onclick = function () {
				startGame = true;
				alertPic.style.backgroundImage = "url(./img/gameover.jpg)";
				//alertPic.style.backgroundSize = "100% 100%";
				gameOver.style.display = "none";
			}
		}
		startGame = false;
	}
}

//生成游戏地图
function mapInit() {
	// 生成格子
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var block = document.createElement('div');
			block.setAttribute('id', i + '-' + j);
			block.classList.add('block');
			map.appendChild(block);
		}
	}

	// 随机格子生成雷
	var count = leiNum;
	while (count) {
		var rNum = Math.floor(Math.random() * 10);
		var cNum = Math.floor(Math.random() * 10);
		var elem = document.getElementById(rNum + '-' + cNum);
		if (!elem.classList.contains('isLei')) {
			elem.classList.add('isLei');
			count--;
		}
	}
}

//左键点击处理逻辑
function leftClickInit() {
	map.onmousedown = function (e) {
		var elem = e.target;
		// 鼠标左键按下
		if (e.which === 1) {
			// 如果点到地雷，则显示所有雷，显示gameOver
			if (elem.classList.contains('isLei')) {
				for (var i = 0; i < map.childNodes.length; i++) {
					if (map.childNodes[i].classList.contains('isLei')) {
						map.childNodes[i].classList.add('leiShow');
					}
				}
				gameOver.style.display = "block";
				map.onmousedown = null;
			} else {
				//没点到雷
				if (elem.classList.contains('showNum')) {
					//点到的是之前点击过并显示数字的格子,则不做任何处理
					return;
				}

				searchLeiNum(elem);
			}
		}
	}
}

//检查点击目标周围的雷的数量
function searchLeiNum(elem) {
	var n = 0;
	var pos = elem.getAttribute('id').split('-');
	var x = +pos[0];
	var y = +pos[1];
	for (var i = x - 1; i <= x + 1; i++) {
		for (var j = y - 1; j <= y + 1; j++) {
			var box = document.getElementById(i + '-' + j);
			if (box && box.classList.contains('isLei')) {
				n++;
			}

		}
	}
	elem.innerHTML = n;
	if (elem && !elem.classList.contains('showNum')) {
		elem.classList.add('showNum');
	}

	//周围的8个格子都没有雷，此时利用递归实现扩散
	if (n === 0) {
		for (var i = x - 1; i <= x + 1; i++) {
			for (var j = y - 1; j <= y + 1; j++) {
				var box = document.getElementById(i + '-' + j);
				if (box && !box.classList.contains('showNum')) {
					searchLeiNum(box);
				}
			}
		}
	}

}

function rightClickInit() {
	map.addEventListener('mousedown', rightClickHandle, false);
}

function rightClickHandle(e) {
	if (e.which === 3) {
		var targetElem = e.target;
		if (targetElem.classList.contains('showNum')) {
			return;
		}

		targetElem.classList.toggle('flag');
		if (targetElem.classList.contains('isLei') && targetElem.classList.contains('flag')) {
			leiNum--;
			score.innerHTML = leiNum;
		} else if (targetElem.classList.contains('isLei') && !targetElem.classList.contains('flag')) {
			leiNum++;
			score.innerHTML = leiNum;
		}


		if (leiNum === 0) {
			alertPic.style.backgroundImage = "url(./img/gamefight.jpg)";
			//alertPic.style.backgroundSize = "100% 100%";
			gameOver.style.display = "block";
		}
	}
}