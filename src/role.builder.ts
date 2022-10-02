const roleBuilder = {

  /** @param {Creep} creep **/
  run: function (creep: Creep) {

    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
      const structs = _.sortBy(_.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_CONTAINER && s.store.getUsedCapacity() > 0), s => (s as StructureContainer).store.getFreeCapacity())
      creep.memory.target = structs[0].id
      creep.say('🔄 collecting');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
      this.pickConstruction(creep)
    }

    if (creep.memory.working) {
      const target = Game.getObjectById(creep.memory.target!) as ConstructionSite
      const bulidingResult = creep.build(target)
      if (bulidingResult == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
      } else if (bulidingResult == ERR_INVALID_TARGET) {
        this.pickConstruction(creep)
      }
    } else {
      const constructionSite = Game.getObjectById(creep.memory.target!) as Structure
      if (creep.withdraw(constructionSite, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(constructionSite, {visualizePathStyle: {stroke: '#ffaa00'}});
      }

    }
  },

  pickConstruction: (creep: Creep) => {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES)
      .sort(function (a, b) {
        if (a.progressTotal - a.progress < b.progressTotal - b.progress) {
          return -1
        }
        if (a.progressTotal - a.progress > b.progressTotal - b.progress) {
          return 1
        }
        return 0
      })
    creep.memory.target = targets[0].id
    creep.say('🚧 build');
  },
};

export default roleBuilder;
