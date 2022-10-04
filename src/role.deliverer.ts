let roleDeliverer = {

  /** @param {Creep} creep **/
  run: function (creep: Creep) {
    if (!creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = true;
      const structs = _.sortBy(_.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_CONTAINER && s.store.getUsedCapacity() > 0), s => (s as StructureContainer).store.getFreeCapacity())
      if (structs.length) {
        creep.memory.target = structs[0].id
      }
      creep.say('🔄 collecting');
    }
    if (creep.memory.working && creep.store.getFreeCapacity() == 0) {
      this.selectDestination(creep)
    }

    if (creep.memory.working) {
      const target: Structure | null = Game.getObjectById(creep.memory.target!) as Structure
      if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
      }
    } else {
      const target: Structure | null = Game.getObjectById(creep.memory.target!) as Structure
      const result = creep.transfer(target, RESOURCE_ENERGY)
      if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
      else {
        this.selectDestination(creep)
      }
    }
  },

  selectDestination: (creep: Creep) => {
    const destinations = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_STORAGE)) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
      }
    })
      .sort(function (a, b) {
        if (a.structureType == STRUCTURE_SPAWN) {
          return -1
        }
        if (b.structureType == STRUCTURE_SPAWN) {
          return 1
        }
        if (a.structureType == STRUCTURE_EXTENSION) {
          return -1
        }
        if (b.structureType == STRUCTURE_EXTENSION) {
          return 1
        }
        if (a.structureType == STRUCTURE_TOWER) {
          return -1
        }
        if (b.structureType == STRUCTURE_TOWER) {
          return 1
        }
        if (a.structureType == STRUCTURE_STORAGE) {
          return -1
        }
        if (b.structureType == STRUCTURE_STORAGE) {
          return 1
        }
        return -1
      })


    creep.memory.working = false;
    creep.memory.target = destinations[0].id
    creep.say('deliver')
  }

};

export default roleDeliverer;
