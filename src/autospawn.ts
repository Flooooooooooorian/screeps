const autospawn = {

  checkAndSpawn: function () {

    this.clearMemory();
    const minerAlive = this.miner();
    this.deliverer();

    if (minerAlive) {
      this.builder();
      this.upgrader();
    }
    else {
      console.log("Waiting for big miner to spawn");
    }


    if (Game.spawns['Spawn1'].spawning) {
      const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
      Game.spawns['Spawn1'].room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        Game.spawns['Spawn1'].pos.x + 1,
        Game.spawns['Spawn1'].pos.y,
        {align: 'left', opacity: 0.8});
    }
  },
  clearMemory: () => {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
      }
    }
  },

  upgrader: () => {
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    if (upgraders.length < 5) {
      const newName = 'Upgrader' + Game.time;

      const result = Game.spawns['Spawn1'].spawnCreep([MOVE, CARRY, CARRY, CARRY, WORK], newName, {
        memory: {
          role: 'upgrader',
          working: false
        }
      });
      if (result != 0) {
        Game.spawns['Spawn1'].spawnCreep([MOVE, CARRY, WORK], newName, {memory: {role: 'upgrader', working: false}});
      }
    }
  },

  builder: () => {
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    const constructionSites = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
    const costs = constructionSites.map(site => site.progressTotal - site.progress).reduce((a, b) => a + b, 0);

    if (builders.length <= 5 && builders.length < (costs / 5000)) {
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
    if (deliverersInMemory.length < containers.length * 2) {
      const newName = 'Deliverer' + Game.time;

      const result = Game.spawns['Spawn1'].spawnCreep([MOVE, CARRY, CARRY, CARRY, WORK], newName, {
        memory: {
          role: 'deliverer',
          working: false
        }
      });
      if (result != 0) {
        Game.spawns['Spawn1'].spawnCreep([MOVE, CARRY, WORK], newName, {memory: {role: 'deliverer', working: false}});
      }
    }
  },

  miner: () => {
    let result: number = -1;
    return Game.spawns['Spawn1'].room
      .find(FIND_SOURCES)
      .map((source) => {
        const minersInMemory = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.target == source.id).sort((a, b) =>  b.body.length - a.body.length);
        if (minersInMemory.length < 1 || minersInMemory[0].body.length < 5) {
          const newName = 'Miner' + source.id + Game.time;
          result = Game.spawns['Spawn1'].spawnCreep([MOVE, CARRY, WORK, WORK, WORK, WORK, WORK], newName, {memory: { role: 'miner', target: source.id, working: false }});
          if (result != 0 && minersInMemory.length < 2) {
            Game.spawns['Spawn1'].spawnCreep([MOVE, CARRY, WORK], newName, { memory: { role: 'miner', target: source.id, working: false } });
          }
          return false;
        }
        else {
          return true;
        }})
      .reduce((a, b) => a && b, true);
  }
};

export default autospawn;
