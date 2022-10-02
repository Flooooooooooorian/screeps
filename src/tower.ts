const tower = {

  run: function() {
    const towers = Object.values(Game.structures).filter(s => s.structureType == STRUCTURE_TOWER) as StructureTower[];
    if(towers.length) {
      towers.forEach(tower => {
        if((tower.store.getCapacity(RESOURCE_ENERGY) / 2) < tower.store.getUsedCapacity(RESOURCE_ENERGY)) {
          const structs = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
          });

          structs.sort(function(a, b ){
            if (a.hitsMax >= 1000000 && b.hitsMax < 1000000) {
              return 1
            }
            if (b.hitsMax >= 1000000 && a.hitsMax < 1000000) {
              return -1
            }
            return a.hits/a.hitsMax > b.hits/b.hitsMax ? 1 : -1
          })

          if(structs.length) {
            tower.repair(structs[0]);
          }
        }

        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
          tower.attack(closestHostile);
        }
      })
    }
  }
};

export default tower;
