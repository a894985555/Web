/**
 * author:zc
 * date:2021-05-01
 */

var container = document.getElementById("myCanvas");
var canvas=document.getElementById("myCanvas");
var context=canvas.getContext("2d");
var blocks = [];
var Timer;
const DIVIDE = 500;
// $.ajaxSettings.async = false;

COLORS = [
    "yellow",
    "pink",
    "orange",
    "white",
]

/**
 * 
 * @param {*} x 当前x坐标
 * @param {*} y 当前y坐标
 * @param {*} r 方块半径
 * @param {*} a 加速度
 * @param {*} dx 偏移量x
 * @param {*} dy 偏移量y
 * @param {*} col 颜色
 * @returns 
 */
var Block = function(x,y,r,a,dx,dy,col) {
    if(x!==undefined) this.x=x;
    if(y!==undefined) this.y=y;
    if(r!==undefined) this.r=r;
    if(a!==undefined) this.a=a;
    if(dx!==undefined) this.dx=dx;
    if(dy!==undefined) this.dy=dy;
    if(col!==undefined) this.col=col;
    return this;
}
Block.prototype = {
    x:10,
    y:10,
    r:10,
    a:0.8,          
    dx:10,          
    dy:10,          
    alpha:1,        
    col:0,          
    twinkle:0,      //是否淡出
    drawBlock:function() {
        this.x+=this.dx*this.a;
        this.y+=this.dy;
        
        //有一定的概率淡出,概率为1/DIVEDE
        if (parseInt(Math.random()*DIVIDE)==1) this.twinkle = 1;
        if (this.twinkle) this.alpha = Math.max(this.alpha-0.01,0);

        context.save();
        context.globalAlpha = this.alpha;
        context.beginPath();
        context.fillStyle = this.col;
        context.rect(this.x,this.y,this.r,this.r);
        context.fill();
        context.restore();
    },
}

/**
 * 产生背景方块掉落且淡出的特效
 */
function drawBlocks() {
    canvas.width = document.documentElement.clientWidth-1;
    // canvas.height = document.documentElement.clientHeight-1;
    canvas.height = $('.myContainer').height();
    context.clearRect(0,0,canvas.width,canvas.height);
    var x = parseInt(Math.random()*canvas.width);
    var y = document.documentElement.scrollTop;
    var r = parseInt(Math.random()*10)+10;
    var dx = parseInt(Math.random()*10)-5;
    var idx = parseInt(Math.random()*COLORS.length);
    var block = new Block(x,y,r,0.3,dx,3,COLORS[idx]);
    blocks.push(block);
    for(var i = 0;i<blocks.length;i++) {
        if(blocks[i].y>canvas.height) {
            blocks.splice(i,1);
        }
    }
    for(var i = 0;i<blocks.length;i++) {
        blocks[i].drawBlock();
    }

    setTimeout(drawBlocks,1000/60);
}

/**
 * @returns 返回时间例如：2021-01-01 12:12:21
 */
function CurrentTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    month = month < 10 ? ("0" + month) : month;
    day = day < 10 ? ("0" + day) : day;
    hour = hour < 10 ? ("0" + hour) : hour;
    minute = minute < 10 ? ("0" + minute) : minute;
    second = second < 10 ? ("0" + second) : second;
    Timer = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    $(".footer-date").html(Timer);
    setTimeout(CurrentTime,1000);
}


drawBlocks();
CurrentTime();