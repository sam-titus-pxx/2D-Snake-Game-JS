
var move_interval;
var last_direction = "R"; //the last direction the player was moved
var r_num;

var edibles_count = 0;
var body = [], edibles_map = new Map();///[n,(x,y)]
var score = 0, health = 3, level = 1;
var stop_status = false;

function Snake(){
   body.push(`${player.x},${player.y}`);
    move_interval = setInterval(function(){
       // movePlayerRight();
        
       //move player in the direction he faces
        moveSnake(player_direction);
        
    },500);
}

function STOP(){
 if(stop_status == false){
     stop_status = true;
     clearInterval(move_interval);
 }
 else if(stop_status == true){
     stop_status = false;
     reset();
 }
}

function reset(){
    clearInterval(move_interval);
    //move player every 1 sec
    move_interval = setInterval(function(){
        moveSnake(player_direction);
      if(edibles_count < 2){
             pushEdible();
         }
    },500);
}

function moveSnake(dir){
  var x,y,alt_x,alt_y;
  var head = body[0].split(","),
      node = "";
    x = parseInt(head[0]);
    y = parseInt(head[1]);
    alt_x = x; alt_y = y;
 
    switch(dir){
      case "R" : alt_x++; player_direction = "R"; break;
      case "U" : alt_y--; player_direction = "U"; break;
      case "L" : alt_x--; player_direction = "L"; break;
      case "D" : alt_y++; player_direction = "D"; break;
    }
   if(isSAccessible(alt_x,alt_y)){
          
      if(map[alt_y][alt_x].getData() == "E"){
          console.log(`Found Edible: ${alt_x},${alt_y}\nNode: ${map[alt_y][alt_x]}`);
          score += 5;
          setScore();
          appendBody();
          
          if(score == 100){
              level+=1;
              setLevel();
              score = 0; setScore();
              if(level == 3){
                  alert("CONGRATS GAME ENDED!");
                  // KILL();
              }
          } pushEdible();
      }
      else if(map[alt_y][alt_x].getData() == "P"){
        var alt_arr = new Array();
        var found = false; health -= 1;
          if(health <= 0){
             // gameOver();
              alert("Game Over!");
              STOP();
              
          }else if(health >= 1){
        for(var k = 0; k < body.length; k++){
          val = body[k];
          v_coord = val.split(",");
          v_x = parseInt(v_coord[0]);
          v_y = parseInt(v_coord[1]);
            
          if((v_x == alt_x) && (v_y == alt_y)){
            found = true;}
            
          if(found == true){
            detachNode(v_x,v_y);
              
            score = ((score-5) < 0)? 0: (score-5);
            
          }else if(found == false){
            alt_arr.push(val);  
          }
        } body = alt_arr; setScore(); setHealth();
      }
    }
     
        body[0] = `${alt_x},${alt_y}`;
        //detachNode(x,y);
        setSNode(alt_x,alt_y,"P");
    
    if(body.length > 1){
    for(var i = 1; i < body.length; i++){
        prev_x = x; prev_y = y;
        node = body[i].split(",");
        x = parseInt(node[0]);
        y = parseInt(node[1]);
        
        body[i] = `${prev_x},${prev_y}`;
        detachNode(x,y);
        setSNode(prev_x,prev_y,"P"); 
    }
   }else{detachNode(x,y);}
  } //end of isSAccessible(x,y)
    
   if(stop_status == false){
    reset();
   
     var head = body[0].split(","),
       h_x = head[0], h_y = head[1];
       map[h_y][h_x].setColor("red");
   }
}

function setScore(){
  //score = (s == "+")? (score+5) : (score-5);
  //alert("Score: "+score);
  document.getElementById("score-count").innerHTML = score;
}

function setHealth(){
  document.getElementById("health-count").innerHTML = health;
}

function setLevel(){
  document.getElementById("level-count").innerHTML = level;
}


function move_place(x,y,n_x,n_y){
   detachNode(x,y);
   setSNode(n_x,n_y,"P"); 
}

function pushEdible(){
    var r_x = Math.floor(Math.random()*8),
    r_y = Math.floor(Math.random()*8);
    
    if(isAccessible(r_x,r_y)){
      var index = edibles_map.size;
      setNode(r_x,r_y,"E"); 
      edibles_map.set(edibles_count,`${r_x},${r_y}`);
      edibles_count++;
    }
}

function popEdible(){ 
   //remove edible obj from edibles_map by index
   
  var rand = getRandNumber(edibles_map.size);
  var coord = edibles_map.get(rand);
  var coord_arr = coord.split(",");
  var x = parseInt(coord_arr[0]),
      y = parseInt(coord_arr[1]);
      detachNode(x,y);
    edibles_map.delete(rand); edibles_count --;
}

function isEdible(x,y){
    //edibles.pop();
    if(map[y][x].getData() == "E"){
        return true;
    }else return false;
}

function removeEdible(x,y){
    var index = -1;
    var coords, c_x, c_y;
    edibles_map.forEach((value,key)=>{
       coords = value.split(",");
       c_x = coords[0];
       c_y = coords[1]; 
        if(c_x == x && c_y == y){
          index = key;
        }
    }); edibles_map.delete(index);
    edibles_count --;
}

function appendBody(){
    var dir = player_direction,
    len = body.length-1,
    coord = body[len].split(",");
    var x = coord[0], y = coord[1];
    
    switch(dir){
     case "R" : x++; break;
     case "U" : y--; break;
     case "L" : x--; break;
     case "D" : y++; break;
    }
    if(isRangeAccessible(x,y)){
        map[y][x].setData("P");
        body.push(`${x},${y}`);
    
        removeEdible(x,y);
    }
}

function setSNode( x, y, type){
       map[y][x].setData(type);
       //document.getElementById(`${x},${y}`).style.backgroundColor = map[y][x].color;
}

function getRandNumber(range){
    return Math.floor(Math.random()*range);
}

function isSAccessible(x, y){
        stat = true;
        if((x < 0) || (x >= map[0].length)){
            stat = false;
        }
        if((y < 0) || (y >= map.length)){
            stat = false;
        }
        if(((y >= 0) && (y < map.length)) && (x >= 0) && (x < map[0].length)){
        var data = map[y][x].getData();
        
        if(!(data == "Pl" || data == "P" || data == "S" || data == "Pr" || data == "D" || data == "G" || data == "Gt" || data == "E")){
            stat = false;
        }
       }
        return stat;
    }

function isRangeAccessible(x,y){
     stat = true;
        if((x < 0) || (x >= map[0].length)){
            stat = false;
        }
        if((y < 0) || (y >= map.length)){
            stat = false;
        }
    return stat;
}