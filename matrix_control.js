
//node, array
//(0,0), [{x,y},{x,y}]
/* node = {
x: ,
y: ,
neighbours: [],
}
*/
var neighbours = new Map();
var player = null, goal_node = null;

var map = new Array();
var map_rows,map_columns;
var player_direction = "R";

function loadMatrix(rows,columns){
    map_rows = rows; map_columns = columns;
   var row_arr;
   var row=null, col=null;
   var str ="", crrnt =null, prev =null, top =null;  
    
    for(var y = 0; y < rows; y++){
        row_arr = new Array();
        row = document.createElement("div"); //`<div class="w3-cell-row">`;
        row.setAttribute("class","w3-cell-row");
        for(var x = 0; x < columns; x++){
            
            crrnt = {
                x: x, y: y,h:0,g:0,f:0,
                data:"Pl", color:"white",
                id:`${x},${y}`,
                neighbours: new Array(),
                weights: new Array(),
                toString: function(){
                  //console.log(`${this.coord} Neighbours:\n`);
                   var str =`Coord: ${this.coord}\nTotal Neighbours: (${this.neighbours.length})\nData: (${this.data})\n`;
                   for(var i=0; i < this.neighbours.length; i++){
                      str += `${this.neighbours[i].coord}|`;
                  }  return str;
                },
                 coord: `${x},${y}`,
                
                //
                setPos : function(x,y){
                  this.x = x; this.y = y;  
                },
                setData: function(data){this.data = data;
        switch(data){
            case "Pl" : this.symbol = "[•]"; this.color="white"; this.h = Math.floor(Math.random()*2);break;
            case "P" : //Player
            this.symbol = "[P]"; this.color="gold"; this.h = Math.floor(Math.random()*2);break; 
            case "E" : //edible
            this.symbol = "[E]"; this.color="green"; this.h = Math.floor(Math.random()*2);break;
            case "S" : //Spawn Point
            this.symbol = "[@]"; this.color="grey"; break;
            case "G" : //Goal Node/Destination
            this.symbol = "[†]"; this.color="red"; this.h = Math.floor(Math.random()*2);break;
            case "W" : //Wall
            this.symbol = "[#]"; this.color="black"; this.h = Math.floor(Math.random()*10)+10;break;
            case "Pr" : //Portal
            this.symbol = "[∆]"; this.color="purple"; this.h = 1;break;
            case "Wt" : //Water
            this.symbol = "[*]"; this.color="aqua"; this.h = Math.floor(Math.random()*5);+10;break;
            case "D" : //Door
            this.symbol = "[&]"; this.color="orange"; this.h = 1;break;
            case "Gt" : //Gate
            this.symbol = "[Π]"; this.color="orange"; this.h = 1; break;
            case "T" : //Tree
            this.symbol = "[$]"; this.color="green"; this.h = Math.floor(Math.random()*10)+10;break;
            default: //Plain/Free Space
            this.data = "Pl";this.symbol = "[•]"; this.h = 1;break;
        }
           document.getElementById(`${this.x},${this.y}`).style.backgroundColor = this.color;
    },
            getData : function(){
             return this.data;
    },
            setColor : function(c){
             this.color = c;
             document.getElementById(`${this.x},${this.y}`).style.backgroundColor = this.color;
            },
    
          getSymbol : function(){
        return this.symbol;
    },
          getID : function(){
        return this.id;
    },
          getF : function(){
        return this.f;
    },
          setF : function(f){
        this.f = f;
    },
          getH : function(){
        return this.h;
    },
         setH : function( h){
        this.h = h;
    },
         getG : function(){
        return this.g;
    },
         setG : function(g){
        this.g = g;
    },
            };//end of object
            
            row_arr.push(crrnt);
            if(prev !== null){
                linkNodes(crrnt, prev);
            }
            if(y > 0){ 
                top = map[y-1][x];
                linkNodes(top,crrnt);       
                }
                prev = crrnt;
            col = document.createElement("div");
            col.setAttribute("class","w3-cell grid-box");
            col.setAttribute(`id`,`${x},${y}`);
            
            row.appendChild(col);
            document.getElementById("grid-matrix").appendChild(row);
        } prev = null;
         map.push(row_arr);
    }
    
}

 function move(coord){
     var coord_arr = coord.split(",");
     var x = parseInt(coord_arr[0]);
     var y = parseInt(coord_arr[1]);
     
     detachNode(player.x,player.y);
     setNode(x,y,"P"); 
 }

function movePlayerUp(){
        var alt_y = (player.y-1), x = player.x;
        if(isAccessible(x,alt_y)){
           detachNode(x,player.y);
           setNode(x,alt_y,"P");  
           player_direction = "U";
         //  console.log("Player Moved Up");
        }
    }
    
function movePlayerDown(){
        var alt_y = (player.y+1), x = player.x;
        if(isAccessible(x,alt_y)){
           detachNode(x,player.y);
           setNode(x,alt_y,"P");  
           player_direction = "D"; 
          // console.log("Player Moved Down")
        }  
    } 
    
function movePlayerLeft(){
        var alt_x = (player.x-1), y = player.y;
        if(isAccessible(alt_x,y)){
           detachNode(player.x,y);
           setNode(alt_x,y,"P");
           player_direction = "L";
          // console.log("Player Moved Left");
        }
    }
    
function movePlayerRight(){
        var alt_x = (player.x+1), y = player.y;
        if(isAccessible(alt_x,y)){
           detachNode(player.x,y);
           setNode(alt_x,y,"P");
           player_direction = "R";
          // console.log("Player Moved Right!")
        }
    }


function linkNodes(n1, n2){
    //console.log(`linking: ${n1.coord} to ${n2.coord}`);
    var w = Math.floor(Math.random()*10);
    n1.neighbours.push(n2);
    n1.weights.push(w);
    n2.neighbours.push(n1);
    n2.weights.push(w);
}

function showBlock(x,y){
    document.getElementById(`${x},${y}`).style.backgroundColor = "red";
}

function displayMap(){
    //console.log("Displaying Map");
    for(var y = 0; y < map.length; y++){
        for(var x= 0; x < map[0].length; x++){
            //console.log(`[${j},${i}]`);
             color = map[y][x].color;
             document.getElementById(`${x},${y}`).style.backgroundColor = color;
        }
    }
}



function showNeighbours(){
       var crrnt = null;
       var str = "";
     for(var y = 0; y < map_rows; y++){
            for(var x = 0; x < map_columns; x++){
           crrnt = map[y][x];
                console.log(`Current Node: ${crrnt.coord}\nNeighbours: ${crrnt.toString()}\n`); 
            }
     }
    }