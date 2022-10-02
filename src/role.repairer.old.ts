const roleRepairerOld = {

  /** @param {Creep} creep **/
  run: function(creep: Creep) {
    if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
    }
    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
      creep.say('working')
    }

    if(creep.memory.working) {
      const structs = creep.room.find(FIND_STRUCTURES, {
        filter: function(object) {
          return object.hits < object.hitsMax &&
            object.structureType != STRUCTURE_WALL
        }
      })

      if (structs.length) {
        if(creep.repair(structs[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(structs[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
      }
      else{
        creep.say("Nothing to repair")
      }
    }
    else {
      const structs = _.sortBy(_.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_CONTAINER && s.store.getUsedCapacity() > 0), s => (s as StructureContainer).store.getFreeCapacity())
      if (structs.length) {
        if(creep.withdraw(structs[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(structs[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
      }
      else{
        creep.say("No Container found")
        const sources = creep.room.find(FIND_SOURCES_ACTIVE)
        //const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE)
        if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
      }
    }
  }
};

export default roleRepairerOld;
