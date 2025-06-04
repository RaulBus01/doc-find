import { AbstractPowerSyncDatabase, PowerSyncBackendConnector, UpdateType  } from "@powersync/react-native"

export class Connector implements PowerSyncBackendConnector {
  /**
  * Implement fetchCredentials to obtain a JWT from your authentication service.
  * See https://docs.powersync.com/installation/authentication-setup
  * If you're using Supabase or Firebase, you can re-use the JWT from those clients, see:
  * https://docs.powersync.com/installation/authentication-setup/supabase-auth
  * https://docs.powersync.com/installation/authentication-setup/firebase-auth
  */
  async fetchCredentials() {
    return {
      // The PowerSync instance URL or self-hosted endpoint
      endpoint: 'https://683ed5478a7b3028979350a4.powersync.journeyapps.com',
      /**
      * To get started quickly, use a development token, see:
      * Authentication Setup https://docs.powersync.com/installation/authentication-setup/development-tokens) to get up and running quickly
      */
      token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6InBvd2Vyc3luYy1kZXYtMzIyM2Q0ZTMifQ.eyJzdWIiOiI2ODNlZDU0NzhhN2IzMDI4OTc5MzUwYTQiLCJpYXQiOjE3NDkwNDMwNzIsImlzcyI6Imh0dHBzOi8vcG93ZXJzeW5jLWFwaS5qb3VybmV5YXBwcy5jb20iLCJhdWQiOiJodHRwczovLzY4M2VkNTQ3OGE3YjMwMjg5NzkzNTBhNC5wb3dlcnN5bmMuam91cm5leWFwcHMuY29tIiwiZXhwIjoxNzQ5MDg2MjcyfQ.DEMEOMcg4eSod8IgyU_Dyv7N_UGCnj8_2VD8j_XJyQaJvf1-3xrUErS7awrgZJDXVk9DUDJoYbDJtYZwvcONbUhxzV7WCPlz-mkx3b03lNon3d6dt18CZiDDwDa_Epsro5q7xj26rwaNsskJzoCA9Puykt0jx4ulGzFeLp9dTgmIrqO1iwUPImCiX5A7TrX1kVNrC48E2HTR47_ZKbmkfvScgYAX7LiZ0-jbGq8cRZabAClVNFkR52aceRN4jzrhMAPtTbazD3WU8McnnV7fWUrVXB8RKCg83kRe0P2cU5ZZZ-7YSE0Kfjw9YROIcsS_eeh7lZPzgRq8XHEFNiLqyg'
    };
  }

  /**
  * Implement uploadData to send local changes to your backend service.
  * You can omit this method if you only want to sync data from the database to the client
  * See example implementation here:https://docs.powersync.com/client-sdk-references/react-native-and-expo#3-integrate-with-your-backend
  */
  async uploadData(database: AbstractPowerSyncDatabase) {

    /**
    * For batched crud transactions, use data.getCrudBatch(n);
    * https://powersync-ja.github.io/powersync-js/react-native-sdk/classes/SqliteBucketStorage#getcrudbatch
    */
    const transaction = await database.getNextCrudTransaction();

    if (!transaction) {
      return;
    }

    for (const op of transaction.crud) {
      // The data that needs to be changed in the remote db
      const record = { ...op.opData, id: op.id };
      switch (op.op) {
        case UpdateType.PUT:
          // TODO: Instruct your backend API to CREATE a record
          break;
        case UpdateType.PATCH:
          // TODO: Instruct your backend API to PATCH a record
          break;
        case UpdateType.DELETE:
          //TODO: Instruct your backend API to DELETE a record
          break;
      }
    }

    // Completes the transaction and moves onto the next one
    await transaction.complete();
  }
  
}