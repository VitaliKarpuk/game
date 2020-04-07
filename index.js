class GemPuzzle {
    constructor(canvas, ctx, cellSize, count, arr) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.arr = arr;
        this.cellSize = cellSize;
        this.newGame = null;
        this.count = count;
        this.second = 1;
        this.min = '00';
        this.numberMoves = document.createElement('span');
        this.timer = document.createElement("span");
        this.interval = null;
        this.buttonSave = null;
    }
    init(){
        this.canvas.width = 405;
        this.canvas.height = 405;
        this.ctx.fillStyle = "gray";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
        document.body.appendChild(this.timer)
        document.body.appendChild(this.numberMoves);   
        this.timer.innerText = `Время: 00 : 00`
        this.numberMoves.innerText = 'Ход: 0'
    }
    save() {
        localStorage.setItem('arr', this.arr)
        this.arr = localStorage.getItem('arr').split(',')
        this.arr = this.arr.map(item => +item)
    }
    times() {
        this.timer.remove();
        this.numberMoves.remove()
        this.count = 0;
        this.second = 1;
        document.body.appendChild(this.timer)
        document.body.appendChild(this.numberMoves)
        clearInterval(this.interval)
        this.interval = setInterval(
            () => {
                this.timer.innerText = `Время:  ${this.min} : ${this.second++}`
                if(this.second === 60){
                    this.second = 0;
                    this.min++;
                }
                if(this.min === 60){
                    this.hour++
                }
            },
            1000
          );
    }
    draw() {
        for(let y = 0; y < 4; y++){
            for(let x = 0; x < 4; x++){
                let position = y * 4 + x;
                let number = this.arr[position];
                let absX = x * this.cellSize + x + 2;
                let absY = y * this.cellSize + y + 2
                if(number !== 0){
                    this.ctx.fillStyle = '#4b5769';
                    this.ctx.fillRect(absX, absY, this.cellSize - 2, this.cellSize -2);
                    this.ctx.font = '40px Sans';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillStyle = '#fff';
                    this.ctx.fillText(number, absX + ((this.cellSize - 2) / 2), absY + ((this.cellSize - 2) / 2));
                }else{
                    this.ctx.clearRect(absX, absY, this.cellSize - 2, this.cellSize - 2)
                }
            }
        }   
    }
    move(x, y) {
        const position = y * 4 + x;
        if(x < 3){
            let positionRight = position + 1;
            if(this.arr[positionRight] === 0 ){
                this.arr[positionRight] = this.arr[position];
                this.arr[position] = 0;
                this.count++
            } 
        }
        //move bottom
        if(y < 3){
            let positionBottom = (y + 1) * 4 + x;
            if(this.arr[positionBottom] === 0){
                this.arr[positionBottom] = this.arr[position];
                this.arr[position] = 0;
                this.count++
            }
        }
        //move left
        if(x > 0){
            let positionLeft = y * 4 + x - 1;
            if(this.arr[positionLeft] === 0){
                this.arr[positionLeft] = this.arr[position];
                this.arr[position] = 0;
                this.count++
            }
        }
        //move top
        if(y > 0){
            let positionTop = (y - 1) * 4 + x;
            if(this.arr[positionTop] === 0){
                this.arr[positionTop] = this.arr[position];
                this.arr[position] = 0;
                this.count++
            }
        }
        this.numberMoves.innerText = `Ход: ${this.count}`
        this.draw()  
    }
    random() {
        function compareRandom() {
            return Math.random() - 0.5;
        }
        return this.arr.sort(compareRandom);
    }
    victory() {
        if(this.hour == 0) this.hour = ''
        if(this.arr.toString() === '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0'){
            alert(`Ура! Вы решили головоломку за ${this.min}мин ${this.second++}с и ${this.count} ходов`);
            clearInterval(this.interval)
        }else{
            return false
        }
    }
}
window.addEventListener('DOMContentLoaded', function() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);  
    let arr;
    const wrapButton = document.createElement('div');
    const newGame = document.createElement('button');
    const buttonSave = document.createElement('button');
    document.body.appendChild(wrapButton)
    wrapButton.appendChild(newGame)
    wrapButton.appendChild(buttonSave);
    newGame.innerText = 'Размешать и начать';
    buttonSave.innerText = 'Сохранить';
    const ctx = canvas.getContext('2d');
    const cellSize = 100;
    let count = 0;
    if(localStorage.getItem('arr') === null){
        arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]
    }else{
        arr = localStorage.getItem('arr').split(',');
        arr = arr.map(item => +item)
    }
    const game = new GemPuzzle(canvas, ctx, cellSize, count, arr);
    game.init();
    buttonSave.addEventListener('click', function () {
        game.save()
    })
    newGame.addEventListener('click', function() {
        game.random();
        game.init();
        game.times();
    });
    canvas.addEventListener('click', function (e) {
        let x = (e.pageX - canvas.offsetLeft);
        let y = (e.pageY - canvas.offsetTop);
        let posX = Math.floor(x/100);
        let posY = Math.floor(y/100)
        game.move(posX, posY)
        game.victory()
    })
})