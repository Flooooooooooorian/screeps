const roleMiner = {

  /** @param {Creep} creep **/
  run: function (creep: Creep) {

    const source = Game.getObjectById(creep.memory.target!) as Source;
    if (source) {
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.say('moving');
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }

    const targets = creep.pos.findInRange(FIND_STRUCTURES, 1, {
      filter: {
        structureType: STRUCTURE_CONTAINER
      }
    });

    if (targets[0]) {
      const result = creep.transfer(targets[0], RESOURCE_ENERGY)
      if (result == ERR_NOT_IN_RANGE) {
        creep.say("not in range")
        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffaa00'}})
      } else if (result != 0) {
        creep.say("unkown: " + result)
      }
    } else {
      creep.say('setup');
      const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
      if (target) {
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
      }
    }
  }
}
export default roleMiner;
