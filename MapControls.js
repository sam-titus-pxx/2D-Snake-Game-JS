
var computed_goal_node_path = false;

function detachNode(x,y){
        setNode(x,y,"Pl");
    }
    
function setNode( x, y, type){
       map[y][x].setData(type);
       document.getElementById(`${x},${y}`).style.backgroundColor = map[y][x].color;
        if(type === "P"){
          player = map[y][x];
          //console.log("Player Node Set!"+map[y][x].coord);
        }
        if(type === "G"){
          goal_node = map[y][x];
         //   out.println("Goal Node Set!");
        }
    }
    
function setPlayer( x, y){
        setNode(x,y,"P");
        //player = map[y][x];
    }
    
function setGoal( x, y){
        setNode(x,y,"G");
        //goal_node = map[y][x];
    }

function loadMap(layout){
      //console.log("Loading Map:\n"+layout)
        var rows = layout.split("\n");
        var coords; //= layout.split("\\|");
        
        //console.log("Rows: "+rows.length);
    
        var x,y;
        var type;
        
        for(var r = 0; r < rows.length; r++){
            sc = rows[r];
            //console.log("SC: "+sc)
          coords = sc.split("|");
            for(var c = 0; c < coords.length-1; c++){
               cs = coords[c];
              // console.log("cs: "+cs);
                type = cs.split(",")[2];
                x = parseInt(cs.split(",")[0]);
                y = parseInt(cs.split(",")[1]);
                
                if(isAccessibleAlt(x,y)){
                    map[y][x].setData(type);
                    setNode(x,y,type)
                }   }
        }   //console.log("PLAYER=> "+player.coord)
    }


    
function isAccessibleAlt( x, y){
        stat = true;
        if((x < 0) || (x > map[0].length)){
            stat = false;
        }
        if((y < 0) || (y > map.length)){
            stat = false;
        }
        var data = map[y][x].getData();
        
        if(data !== "Pl"){
            stat = false;
        }
        return stat;
    }


function isAccessible(x, y){
        stat = true;
        if((x < 0) || (x > map[0].length)){
            stat = false;
        }
        if((y < 0) || (y > map.length)){
            stat = false;
        }
        if(((y >= 0) && (y < map.length)) && (x >= 0) && (x < map[0].length)){
        var data = map[y][x].getData();
        
        if(!(data == "Pl" || data == "S" || data == "Pr" || data == "D" || data == "G" || data == "Gt" || data == "E")){
            stat = false;
        }
       }
        return stat;
    }


function embark(){
        //starting from the current player position, [P]
        //compute journey path to Goal Node, [G]
        
        var visited = new Set();//ID
        var select_list = new Set();//node object
        
        var t_cost =0,g=-1,f=0,h=-1;
        var min_f = -1,order = 1;
        var reached = false;
        var path = "",path_coords = "";
        
        select_list.add(player);
        visited.add(player.getID());
        var Q = null;
        var prev_node = player.coord;
        
        //Begin Search Journey to Goal Node
        while(select_list.size > 0){
            min_f = -1;
          select_list.forEach(function(gn){
              if(min_f == -1){
              min_f = gn.getF();
              prev_node = Q;
              Q = gn; //prev_node = gn;
            }
              if(gn.getF() < min_f){
                  prev_node = Q;
                  Q = gn; 
                  min_f = gn.getF();
              }
          });
            path += `${order}) ${Q.coord}\n`;
                  order++;
            path_coords += `${Q.coord}\n`;
            select_list.clear();
            if(Q.getID() == goal_node.getID()){
              reached = true;
              computed_goal_node_path = true;
              console.log(`GOAL NODE (${goal_node.coord}) REACHED!\n`);
              ///console.log(`Previous Node: ${prev_node.coord}\n`);
              break;
            }
             if(flip() > 1){Q.neighbours.revese();}
            
            for(var e = 0; e < Q.neighbours.length; e++){
               var n = Q.neighbours[e];
                if(n.getH() < 10){
                h = manhattan_distance(n,this.goal_node);
                g = n.weights[e] + t_cost;
                f = g + h;
                n.setG(g); n.setF(f); n.setH(h);
                if(!visited.has(n.getID())){
                    select_list.add(n);
                    visited.add(n.getID());
                }
            }} t_cost = g;
            if(!visited.has(Q.getID())){
                visited.add(Q.getID());
            }
            if(select_list.size === 0 && !reached){
              console.log(`GOAL NODE ${goal_node.coord} COULD NOT BE REACHED!\nSTUCK AT ${Q.coord}\n`);
              //console.log(`Previous Node: ${prev_node}\n`);
              computed_goal_node_path = false;
            }
        } //console.log(` => PATH COMPUTED <=\n${path}\n`); 
     return path_coords;
}

function pathComputed(){return computed_goal_node_path;}

function flip(){ return Math.floor(Math.random()*2); }


function manhattan_distance(s, g){
        var h = -1;
         h = Math.abs(s.x - g.x) + 
             Math.abs(s.y - g.y);
        return h;
    }