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
  // Uses the backend connector that will be created in the next section
  const connector = new Connector();
  powersync.connect(connector);
};

export const getPowerSyncDatabase = () => {
    // PowerSync exposes the underlying database through the database property
    return powersync.database;
};