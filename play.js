// variveis do game
var canvas, ctx, heigth, width, frame = 0, maxJump = 3, gVelocity = 6, actualState, record,

    states = {
        statePlay: 0,
        statePlaying: 1,
        stateGameover: 2
    },

    floor = {
        y: 550,
        floorHeigth: 50,
        color: '#ffdf70',

        floorDraw: function () {
            ctx.fillStyle = this.color
            ctx.fillRect(0, this.y, width, this.floorHeigth)
        }
    },
    //--------------------------------------------------------------------->
    block = {
        x: 50,
        y: 0,
        blockHeigth: 50,
        blockWidth: 50,
        blockColor: '#ff4e4e',
        gravity: 1.5,
        velocity: 0,
        powerJump: 18,
        qtJump: 0,
        Score: 0,

        blockReflesh: function () {
            this.velocity += this.gravity
            this.y += this.velocity

            if (this.y > floor.y - this.blockHeigth && actualState != states.stateGameover) {
                this.y = floor.y - this.blockHeigth
                this.qtJump = 0
                this.velocity = 0
            }
        },
        //--------------------------------------------------------------------->
        jump: function () {
            if (this.qtJump < maxJump) {
                this.velocity = -this.powerJump
                this.qtJump++
            }

        },
        blockReset: function () {
            this.velocity = 0
            this.y = 0
            if(this.Score > record){
                localStorage.setItem('record', this.Score)
                record = this.Score
            }
            this.Score = 0

        },
        //--------------------------------------------------------------------->
        blockDraw: function () {
            ctx.fillStyle = this.blockColor
            ctx.fillRect(this.x, this.y, this.blockWidth, this.blockHeigth)
        }

    }
//--------------------------------------------------------------------->
obstacles = {
    obs: [],
    timeInsert: 0,
    insert: function () {
        this.obs.push({
            x: width,
            // obsWidth: 30 + Math.floor(21 * Math.random()),
            obsWidth: 50,
            obsHeigth: 30 + Math.floor(91 * Math.random()),
            obsColor: '#ffbc1c'
        })
        this.timeInsert = 30 + Math.floor(101 * Math.random())
    },
    obsReflesh: function () {
        if (this.timeInsert == 0) {
            this.insert()
        }
        else {
            this.timeInsert--
        }
        for (var i = 0, tam = this.obs.length; i < tam; i++) {
            var obst = this.obs[i]
            obst.x -= gVelocity

            if (block.x <= obst.x + obst.obsWidth && block.x + block.blockWidth >= obst.x && block.y + block.blockHeigth >= floor.y - obst.obsHeigth) {
                actualState = states.stateGameover
            }
            else if (obst.x == 0) {
                block.Score++
            }

            else if (obst.x <= -obst.obsWidth) {
                this.obs.splice(i, 1)
                tam--
                i--
            }
        }
    },
    clear: function () {
        this.obs = []
    },
    obsDraw: function () {
        for (var i = 0, tam = this.obs.length; i < tam; i++) {
            var obst = this.obs[i]
            ctx.fillStyle = obst.obsColor
            ctx.fillRect(obst.x, floor.y - obst.obsHeigth, obst.obsWidth, obst.obsHeigth)
        }

    }
}

function click(event) {
    if (actualState == states.statePlaying) {
        block.jump()
    }
    else if (actualState == states.statePlay) {
        actualState = states.statePlaying
    }
    else if (actualState == states.stateGameover && block.y >= 2 * heigth) {
        actualState = states.statePlay
        obstacles.clear()
        block.blockReset()
    }

}
//Função principal do game
function main() {
    heigth = window.innerHeight;
    width = window.innerWidth;

    if (width >= 500) {
        width = 600;
        heigth = 600;
    }
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = heigth;
    canvas.style.border = '1px solid #000';

    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas)

    document.addEventListener('mousedown', click)

    actualState = states.statePlay
    record = localStorage.getItem('record')
    if(record == null){
        record = 0
    }
    play();
}
function play() {
    reflesh();
    draw();

    window.requestAnimationFrame(play)
}
function reflesh() {
    frames++
    block.blockReflesh()
    if (actualState == states.statePlaying) {
        obstacles.obsReflesh()
    }

}
function draw() {
    ctx.fillStyle = "#50beff"
    ctx.fillRect(0, 0, width, heigth)

    //---------------------------------------APRESENTA RECORD NO CANTO DA TELA
    ctx.fillStyle = '#fff'
    ctx.font = '50px Arial'
    ctx.fillText(block.Score, 30, 50)

    if (actualState == states.statePlay) {
        ctx.fillStyle = 'green'
        ctx.fillRect(width / 2 - 50, heigth / 2 - 50, 100, 100)
    }
    else if (actualState == states.stateGameover) {
        ctx.fillStyle = 'red'
        ctx.fillRect(width / 2 - 50, heigth / 2 - 50, 100, 100)

        ctx.save()
        ctx.translate(width / 2, heigth / 2)
        ctx.fillStyle = '#fff'
        //----------------------------------APRESENTA NOVO RECORD / RECORD SALVO
        if(block.Score > record){
            ctx.fillText('Novo Record !', -150, -65)
        }
        else if(record < 10){
            ctx.fillText(`Record ! ${record}`, -99, -65)
        }
        else if(record >= 10 && record < 100){
            ctx.fillText(`Record ! ${record}`, -112, -65)
        }
        else {
            ctx.fillText(`Record ! ${record}`, -125, -65)
        }
        //------------------------------- RECORD NO MEIO DA TELA
        if(block.Score < 10){
            ctx.fillText(block.Score, -13, 19)
        }
        else if(block.Score >= 10 && block.Score < 100){
            ctx.fillText(block.Score, -26)
        }
        else {
            ctx.fillText(block.Score, -39, 19)
        }
        ctx.restore()
    }
    else if (actualState == states.statePlaying) {
        obstacles.obsDraw()
    }
    floor.floorDraw()
    block.blockDraw()
}
//Inicializa o game
main()
