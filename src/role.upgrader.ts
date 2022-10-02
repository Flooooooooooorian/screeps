const roleUpgrader = {

  /** @param {Creep} creep **/
  run: function(creep: Creep) {

    if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
      creep.say('🔄 harvest');
    }
    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
      creep.say('⚡ upgrade');
    }

    if(creep.memory.working) {
      if(creep.upgradeController(creep.room.controller!) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller!, {visualizePathStyle: {stroke: '#ffffff'}});
      }
    }
    else {
      const structs = _.sortBy(_.filter(creep.room.find(FIND_STRUCTURES), (structs) => structs.structureType == STRUCTURE_CONTAINER && structs.store.getUsedCapacity() > 0), structs => (structs as StructureContainer).store.getFreeCapacity())
      if (structs.length) {
        if(creep.withdraw(structs[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(structs[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
      }
    }
  }
};

export default roleUpgrader;
