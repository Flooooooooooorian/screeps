import { ErrorMapper } from "utils/ErrorMapper";
import roleDeliverer from 'role.deliverer';
import roleUpgrader from 'role.upgrader';
import roleBuilder from 'role.builder';
import roleMiner from 'role.miner';
import roleRepairerOld from 'role.repairer.old';
import autospawn from 'autospawn';
import tower from 'tower';

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: string;
    working: boolean;
    target?: Id<_HasId>;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  autospawn.checkAndSpawn()

  for(const name in Game.creeps) {
    const creep = Game.creeps[name];
    if(creep.memory.role == 'deliverer') {
      roleDeliverer.run(creep);
    }
    if(creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
    if(creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    }
    if(creep.memory.role == 'miner') {
      roleMiner.run(creep);
    }
    // if(creep.memory.role == 'repairer') {
    //   roleRepairerOld.run(creep);
    // }

    tower.run()
  }
});
