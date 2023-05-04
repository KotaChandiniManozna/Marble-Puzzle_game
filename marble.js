let b, marbles = [], holes, d, rows, gameBoard;

window.onload = ()=>{

alert("The goal is to have only one marble remaining.  Remove marbles by jumping over them with another marble.  Diagonal moves are not allowed and marbles can only move by jumping over another marble to an open spot. To start, click on a marble then tap on an open spot to jump to.  Keep jumping until all but one marble remains.");

document.querySelector('.loader').style.display = "none";
init();

}

function init(){
    
    //try changing the gameboard for a different challenge.  0 for a blank space, 1 for a hole and 2 for a marble
    gameBoard = [
        [0,0,2,2,2,0,0],
        [0,2,2,1,2,2,0],
        [2,2,2,2,2,2,2],
        [2,2,2,2,2,2,2],
        [2,2,2,2,2,2,2],
        [0,2,2,2,2,2,0],
        [0,0,2,2,2,0,0],
    ];

    b = document.getElementById('board');

    b.innerHTML = "";

    gameBoard.forEach((r,i)=>{
        let row = document.createElement('div');
        row.className = "row";
        r.forEach((h,j)=>{
            let space = document.createElement('div');
            if(h === 1 || h === 2){
                space.className = "hole";
                space.addEventListener("click", moveMarble);
                space.setAttribute('data-pos',j+','+i);
            }else{
                space.className = "blank";
            }
            row.appendChild(space);
        });
        b.appendChild(row);
    });
    
    let rb = document.querySelector(".restart");
    rb.style.display = "none";
    rb.style.opacity = 0;

    marbles.forEach(m=>{
        document.querySelector(".container").removeChild(m);
    });

    rows = document.querySelectorAll(".row"); 
    holes = document.querySelectorAll(".hole"); 
    marbles = [];

    rows.forEach((row,i)=>{
        row.childNodes.forEach((h,j)=>{
            let r = h.getBoundingClientRect();
            
            if(gameBoard[i][j] === 2){
                marbles.push(marble(r.left,r.top, j, i));                
            }
        });
    });    
    
    let l1 = holes[1].getBoundingClientRect().left;
    let l2 = holes[0].getBoundingClientRect().left;
    d = l1-l2;
    }

function marbleClick(e){
    e.preventDefault();
    let se = document.querySelector(".selected");
    if(se){
        se.classList.remove("selected");
    }
    if(se !== e.target){
        e.target.classList.add("selected");
    }
}

function moveMarble(e){
    e.preventDefault();
    let m = document.querySelector(".selected");
    
    if(m && legalMove(m, e.target)){
        let hPos = getPos(e.target);
        let mPos = getPos(m);
        gameBoard[hPos[1]][hPos[0]] = 2;
        gameBoard[mPos[1]][mPos[0]] = 1;
        m.setAttribute('data-pos',hPos[0]+","+hPos[1]);
        let r = e.target.getBoundingClientRect();
        m.style.left = r.left-1+"px";
        m.style.top = r.top-1+"px";
        m.classList.remove("selected");
        checkEnd();
        
    }
}

function getPos(elem){
    return elem.dataset.pos.split(',');
}

function legalMove(m, h){
    let mPos = getPos(m);
    let hPos = getPos(h);

    if(mPos[0] == hPos[0] && Math.abs(mPos[1] - hPos[1]) == 2){
        if(checkForMarble(mPos[0],parseInt(mPos[1])-parseInt((mPos[1]-hPos[1])/2))){
            return true;
        }else{
            return false;
        }
    }else if(mPos[1] == hPos[1] && Math.abs(mPos[0] - hPos[0]) == 2){
        if(checkForMarble(parseInt(mPos[0])-parseInt((mPos[0]-hPos[0])/2), mPos[1])){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

function checkForMarble(x,y, check){
    check = check || false;
    
    for(let i = 0; i<marbles.length; i++){
        let mPos = getPos(marbles[i]);
        if(mPos[0] == x && mPos[1] == y){
            if(!check){
                marbles[i].style.opacity = 0; 
                    document.querySelector(".container").removeChild(marbles[i]);
                
                    gameBoard[y][x] = 1;
                    marbles.splice(i, 1);
                
            }
            return true;
            break;
        }
    }
    return false;
}


function checkForHole(x,y){
    for(let i = 0; i<holes.length; i++){
        let hPos = getPos(holes[i]);
        if(hPos[0] == x && hPos[1] == y){
            return true;
            break;
        }
    }
    return false;
}



function checkEnd(){
    for(let i = 0; i<marbles.length; i++){
        let mPos = getPos(marbles[i]);
        for(let j = 0; j<4; j++){
            if(checkForMarble(parseInt(mPos[0])+getLegalX(j), parseInt(mPos[1])+getLegalY(j), true) && checkForHole(parseInt(mPos[0])+2*getLegalX(j), parseInt(mPos[1])+2*getLegalY(j)) && !checkForMarble(parseInt(mPos[0])+2*getLegalX(j), parseInt(mPos[1])+2*getLegalY(j), true)){
                return false;
                break;
            }
        }
    }
    setTimeout(()=>{
        if(marbles.length>1){
            alert("No more possible moves! You left "+marbles.length+" marbles");
            let rb = document.querySelector(".restart");
            rb.style.display = "flex";
            rb.style.opacity = 0.7;
        }else{
            alert("You win! Congratulations you're a genius!");
        }
    },500);
    
}

function getLegalX(j){
    if(j<2){
        return 0;
    }else if(j%2 == 0){
        return -1;
    }else{
        return 1;
    }
}

function getLegalY(j){
    if(j>=2){
        return 0;
    }else if(j%2 == 0){
        return -1;
    }else{
        return 1;
    }
}

let marble = function(drawX, drawY, posX, posY){
    let m = document.createElement("div");
    m.className = "marble";
    m.setAttribute('data-pos',posX+","+posY);
    let r = 165*Math.random()+90;
    let g = 165*Math.random()+90;
    let b = 165*Math.random()+90;
    m.style.background = "rgb("+r+","+g+","+b+")";
    m.style.left = drawX-1+"px";
    m.style.top = drawY-1+"px";
    
    m.addEventListener('click', marbleClick);
    document.querySelector('.container').appendChild(m);
    setTimeout(()=>{
        m.style.opacity = 1;
    },250);
    return m;
}
