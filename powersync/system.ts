import { PowerSyncDatabase } from '@powersync/react-native';
import { AppSchema } from './chatSchema';
import { Connector } from './connector';
export const powersync = new PowerSyncDatabase({
    // The schema you defined in the previous step
    schema: AppSchema,
    // For other options see,
    // https://powersync-ja.github.io/powersync-js/web-sdk/globals#powersyncopenfactoryoptions
    database:{
      dbFilename: 'chats.db',
      
    }
    
});


export const setupPowerSync = async () => {
  const connector = new Connector();
  powersync.connect(connector);
};

export const getPowerSyncDatabase = () => {

    return powersync.database;
};