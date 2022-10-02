const autospawn = {

  checkAndSpawn: function() {

    this.clearMemory();
    this.miner();
    this.deliverer();
    this.builder();
    this.upgrader();

    if(Game.spawns['Spawn1'].spawning) {
      const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
      Game.spawns['Spawn1'].room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        Game.spawns['Spawn1'].pos.x + 1,
        Game.spawns['Spawn1'].pos.y,
        {align: 'left', opacity: 0.8});
    }
  },
  clearMemory: () => {
    for(const name in Memory.creeps) {
      if(!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
      }
    }
  },

  upgrader: () => {
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    if (upgraders.length < 1) {
      const newName = 'Upgrader' + Game.time;
      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
        {memory: {role: 'upgrader', working: false}});
    }
  },

  builder: () => {
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    const constructionSites = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);

    if(builders.length < (constructionSites.length / 10)) {
      const newName = 'Builder' + Game.time;
      Game.spawns['Spawn1'].spawnCreep([CARRY, WORK, MOVE], newName,
        {memory: {role: 'builder', working: true}});
    }
  },

  deliverer: () => {
    const containers = Game.spawns['Spawn1'].room
      .find(FIND_STRUCTURES, {
        filter: (structure) => {
          return structure.structureType == STRUCTURE_CONTAINER;
        }
      })
    const deliverersInMemory = _.filter(Memory.creeps, (creep) => creep.role == 'deliverer')
    if (deliverersInMemory.length < containers.length) {
      const newName = 'Deliverer' + Game.time;
      Game.spawns['Spawn1'].spawnCreep([CARRY, WORK, MOVE], newName,
        {memory: {role: 'deliverer', working: false}});
    }
  },

  miner: () => {
      Game.spawns['Spawn1'].room
        .find(FIND_SOURCES)
        .forEach((source) => {
          const minersInMemory = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.target == source.id);
          if(minersInMemory.length < 2) {
            const newName = 'Miner' + source.id + Game.time;
            const result = Game.spawns['Spawn1'].spawnCreep([MOVE, CARRY, WORK, WORK, WORK], newName, {memory: {role: 'miner', target: source.id, working: false}});
            if(result != 0) {
              Game.spawns['Spawn1'].spawnCreep([MOVE, CARRY, WORK], newName, {memory: {role: 'miner', target: source.id, working: false}});
            }
          }
        });
  }
};

export default autospawn;
