
///****************** */
var fs = require('fs');
//
var traces,
    isVisited ={};

/**
 *Making array containing visited stops and distance to Start 
 * @param {obj} parsed file
 */
function prepareIsVisitedArray(json_file){
    for (var k =0;k<json_file.nodes.length;k++){
        isVisited[json_file.nodes[k].id]={"isVisited":false,"value":undefined};
    }
    return;
}

/**
 * making traces bi-directional 
 * @param {obj} parsed file
 * @returns {null}
 */
function makeBidirectional(json_file){
    traces = json_file["links"];
    let len = traces.length;
    for(var i=0;i<len;i++){
        let el = traces[i];
        traces.push({"distance":el.distance,"source": el.target,"target": el.source
        });
    }
    return null;
}
/**
 * Initialize .json file
 * @param {string} filename name of the .json file
 */
function Init(filename){
    //solvro_city.json
    let f = fs.readFileSync(filename,"utf-8");
    var json_file = JSON.parse(f);
    prepareIsVisitedArray(json_file);
    makeBidirectional(json_file);
}

/** 
 * Define begining stop
 * @param {string} start id of the starting stop  
 * @returns {number} if everything ok returns 0 else 1
*/
function initializeDistances(start){
    for(var i=0;i<traces.length;i++){
        if(traces[i].source == start){
            isVisited[traces[i].target].value = traces[i].distance;
        }
    }
    if(markAsVisited(start)){
        return 1;
    }
    else return 0;
}
/**
 * Searching through traces array to find the shortest distance to next stop 
* @param {string} start type: string id of the starting stop  
*/
function findDistances(target){
    var previousDistace = isVisited[target].value;
    for(var i=0;i<traces.length;i++){
        var found = traces[i];
        if(found.source == target){
            let distanceToStart = isVisited[found.target].value;
            let measuredDistance = found.distance + previousDistace;
            //console.log(distanceToStart,measuredDistance);
            if(distanceToStart == undefined || (distanceToStart > measuredDistance)){
                isVisited[found.target].value = measuredDistance;
            }
        }
    }
    markAsVisited(target);
}
/**
 * 
 * @param {string} target marking as visited in isVisited array
 * @returns {number} retuns 1 
 */
function markAsVisited(target){
    isVisited[target].isVisited = true;
    return 1;
}

/**
 * @returns {string} id of the next city to 'visit'|false if thre is no city left
 */
function chooseSubTarget(){
    for(k in isVisited){
        if(isVisited[k].isVisited == false && isVisited[k].value != undefined){
            isVisited[k].isVisited=true;
            return k

        }
    }
    return false;
}

/**
 * 
 * @param {string} Start id of first element to measure from
 * @returns {Array} list of distances between Start and all stops
 */
function measureAllDistances(start){
    initializeDistances(start);
    var nextCity = chooseSubTarget() ;
    while(nextCity){
        findDistances(nextCity);
        nextCity =chooseSubTarget()
    }
    return isVisited;
}
Init("solvro_city.json")
measureAllDistances("5");
