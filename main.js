const room = Game.rooms['sim'];
const visual = room.visual;

let roads = [];
let dests = [
    new RoomPosition(25, 1, 'sim'),
    new RoomPosition(48, 25, 'sim'),
    new RoomPosition(25, 48, 'sim'),
    new RoomPosition(1, 25, 'sim')
];

dests.push(room.controller.pos);
const sources = room.find(FIND_SOURCES);
dests = dests.concat(sources.map((s) => s.pos));
const spawns = room.find(FIND_MY_SPAWNS);
dests = dests.concat(spawns.map((s) => s.pos));
const containers = room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER } });
dests = dests.concat(containers.map((s) => s.pos));

const center = new RoomPosition(25, 25, 'sim');

let heuristicWeight = 1.2;

module.exports.loop = function () {
    visual.circle(25, 25);
    roads = [];
    
    const mainMatrix = new PathFinder.CostMatrix();
    
    for (var i = 0; i < dests.length; i++) {
        const dest = dests[i];
        const path = PathFinder.search(center, { pos: dest, range: 1 }, { plainCost: 4, swampCost: 5,  heuristicWeight, roomCallback: (roomName) => mainMatrix });
        
        for (var j = 0; j < path.path.length; j++) {
            const step = path.path[j];
            mainMatrix.set(step.x, step.y, 1);
        }
        
        roads.push(path.path);
    }
    
    printNumRoads();
}

function printNumRoads() {
    const allPos = [];
    
    for (var i = 0; i < roads.length; i++) {
        const dest = dests[i];
        const road = roads[i];
        if (road) {
            let line = [center];
            line = line.concat(road);
            line.push(dest)
            
            visual.poly(line, { opacity:0.75, stroke: "#00FF00" });
            if (dest) {
                visual.text(road.length, dest.x + 1, dest.y + 1);
            }
            
            for (var j = 0; j < road.length; j++) {
                const pathStep = road[j];
                if (!allPos.find((s) => s.x == pathStep.x && s.y == pathStep.y)) {
                    allPos.push(pathStep);
                }
            }
        }
    }
    
    for (var i = 0; i < allPos.length; i++) {
        const pos = allPos[i];
        var adjCount = 0;
        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                if (!(dx == 0 && dy == 0)) {
                    const otherPos = new RoomPosition(pos.x + dx, pos.y + dy, 'sim');
                    if (allPos.find((s) => s.isEqualTo(otherPos))) {
                        ++adjCount;
                    }
                }
            }
        }
        
        if (adjCount > 3) {
            visual.circle(pos, { fill: "#00FF00", radius: 0.35 })
        }
    }
    
    visual.text(allPos.length, 4, 4)
}
