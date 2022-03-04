const room = Game.rooms['sim'];
const visual = room.visual;

let roads = [];
const dests = [
    new RoomPosition(25, 1, 'sim'),
    new RoomPosition(48, 25, 'sim'),
    new RoomPosition(25, 48, 'sim'),
    new RoomPosition(1, 25, 'sim'),
    new RoomPosition(22, 15, 'sim'),
    new RoomPosition(43, 44, 'sim'),
    new RoomPosition(6, 44, 'sim'),
    new RoomPosition(35, 2, 'sim'),
    new RoomPosition(34, 11, 'sim'),
    new RoomPosition(25, 17, 'sim'),
    new RoomPosition(15, 31, 'sim'),
    new RoomPosition(35, 40, 'sim')
];
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
    const allRoads = [];
    
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
                if (!allRoads.find((s) => s.x == pathStep.x && s.y == pathStep.y)) {
                    allRoads.push(pathStep);
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
    
    visual.text(allRoads.length, 4, 4)
}
