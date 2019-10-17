//measureDistance.js


var fs = require('fs');
//
var traces,
    isVisited ={},
    cityList;

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
    cityList = json_file.nodes;
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
/**
 * @returns list containg stops names and ids
 */
function cityNames(){
    return cityList;
}
/**
 *
 * @param {string} name name of the stop
 * @returns {string|boolean} id of the stop if is in the list; false if found nothing
 */
function nameToId(name){
    let l = cityNames;
    for (var k=0; k<l.length;k++){
        let el = l[k];
        if(el["stop_name"] === name){
            return el["id"]
        }
    }
    return false;
}
/**
 * @param {string} start  id of staring stop
 * @param {string} stop id of ending stop
 * @returns {string|number} returns number if there is route between stops; returns string msg if not
 */
function distanceBetweenById(start,end){
    let dist = measureAllDistances(start);
    if(dist[end] && dist[start]){
        //alghoritm measres distance if start and end are the same stop
        if(start === end){
            return 0;
        }

            if(dist[end].value !== undefined){
                return dist[end].value
            }
            else{
                //some of generated graphs hadn't routs to every single stop
                return "No route to the stop"
            }
    }
    else{
        return "No stop with specyfic id, check the list containg stops"
    }
}
/**
 *
 * @param {string} start name of staring stop
 * @param {string} stop name of ending stop
 * @returns {string|number} number if there is route between stops; returns string msg if not
 */
function distanceBetweenByName(start,end){
    let startId = nameToId(start);
    let endId = nameToId(end);
    if(startId == false || endId == false){
        return "No stop with specyfic name, check the list containg stops"
    }
    let dist = measureAllDistances(start);
    if(dist[end] && dist[start]){
        //alghoritm measres distance if start and end are the same stop
        if(start === end){
            return 0;
        }
        if(dist[end].value !== undefined){
            return dist[end].value
        }
        else{
            //some of generated graphs hadn't routs to every single stop
            return "No route to the stop"
        }
    }
    else{
        return "No stop with specyfic name, check the list containg stops"
    }
}
module.exports.loadFile = Init;
module.exports.cityNames = cityNames;
module.exports.distById = distanceBetweenById;
module.exports.distByName = distanceBetweenByName;