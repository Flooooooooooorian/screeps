let roleDeliverer = {

  /** @param {Creep} creep **/
  run: function (creep: Creep) {
    if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      this.selectDestination(creep)
    }
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      this.selectSource(creep)
    }

    if (!creep.memory.working) {
      const target: Structure | null = Game.getObjectById(creep.memory.target!) as Structure
      const result = creep.withdraw(target, RESOURCE_ENERGY)
      if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
      }
      else {
        this.selectSource(creep)
      }
    } else {
      const target: Structure | null = Game.getObjectById(creep.memory.target!) as Structure
      const result = creep.transfer(target, RESOURCE_ENERGY)
      if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
      } else {
        this.selectDestination(creep)
      }
    }
  },

  selectSource: (creep: Creep) => {
      const structs = _.sortBy(_.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_CONTAINER && s.store.getUsedCapacity() > 0), s => (s as StructureContainer).store.getFreeCapacity())
      if (structs.length) {
        creep.memory.target = structs[0].id
        creep.memory.working = false;
      }
    creep.say('🔄 collecting');
  },

  selectDestination: (creep: Creep) => {
    console.log('selecting destination')
    const destinations = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_STORAGE)) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
      }
    })
      .sort(function (a, b) {
        if (a.structureType == STRUCTURE_EXTENSION) {
          return -1
        }
        if (b.structureType == STRUCTURE_EXTENSION) {
          return 1
        }
        if (a.structureType == STRUCTURE_SPAWN) {
          return -1
        }
        if (b.structureType == STRUCTURE_SPAWN) {
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

    if (destinations.length) {
      creep.memory.working = true;
      creep.memory.target = destinations[0].id
      creep.say('deliver')
    }
  }

};

export default roleDeliverer;
