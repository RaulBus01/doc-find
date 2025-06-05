import { secureGetValueFor } from "@/utils/SecureStorage";
import { AbstractPowerSyncDatabase, PowerSyncBackendConnector, UpdateType  } from "@powersync/react-native"
import { Toast } from "toastify-react-native";

export class Connector implements PowerSyncBackendConnector {
  /**
  * Implement fetchCredentials to obtain a JWT from your authentication service.
  * See https://docs.powersync.com/installation/authentication-setup
  * If you're using Supabase or Firebase, you can re-use the JWT from those clients, see:
  * https://docs.powersync.com/installation/authentication-setup/supabase-auth
  * https://docs.powersync.com/installation/authentication-setup/firebase-auth
  */
 
  async fetchCredentials() {
      
    const accessToken = await secureGetValueFor('accessToken');
    if (!accessToken)
    {return null;}
    

    return {

      // The PowerSync instance URL or self-hosted endpoint
      endpoint: 'https://683ed5478a7b3028979350a4.powersync.journeyapps.com',
      /**
      * To get started quickly, use a development token, see:
      * Authentication Setup https://docs.powersync.com/installation/authentication-setup/development-tokens) to get up and running quickly
      */
      token:accessToken,
      //token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InAtTjlKd3NnN3RRWnU4b3FTT2k3TyJ9.eyJpc3MiOiJodHRwczovL2Rldi0yMHB6dWl2dDBsZm81aGh5LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMzAxODUyMjA3NTQ0MDMwODc3MiIsImF1ZCI6WyJodHRwczovLzY4M2VkNTQ3OGE3YjMwMjg5NzkzNTBhNC5wb3dlcnN5bmMuam91cm5leWFwcHMuY29tIiwiaHR0cHM6Ly9kZXYtMjBwenVpdnQwbGZvNWhoeS51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzQ5MTEzMjUwLCJleHAiOjE3NDkxOTk2NTAsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhenAiOiJ2OVVQM1VTbWcwTnZ3WlRnSFRZS0NBT0ViT1VSWVNtRCJ9.LoeFL632kY3pyEeH4nhdiWyKiFaV4URgmCjDsvOngk8KQ4ZeZWf6M_etTx_sEQiB-9_BcmXxqkn0uV4iODj36MLIYOyb1vlOJRvzRE32D_Jo_a7qOsJQXmZ5TRC8us2FIBhQDOlqvVTLPnwtid1rr8ZjTuqPWAofvciSQ1TF6ZtHqrVGzG6YyJAQ922hrisXw1uorjt-duddBVRkam2XUvIKw3HlFxmtmvcnPjdHIIfcsDkF9fsKxKBsDemnHJcyAElezjUJooDX37XjjbcG-3osZ60dCJbnBMW5oSNHTGk2YNENVHUC0jnPHIbv6AxyrGrM-7bc51jwnTYABiNCiQ'
      // token:'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InAtTjlKd3NnN3RRWnU4b3FTT2k3TyJ9.eyJpc3MiOiJodHRwczovL2Rldi0yMHB6dWl2dDBsZm81aGh5LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNDIxMDk4Mjk4ODYyNzM4Nzk4OCIsImF1ZCI6WyJodHRwczovLzY4M2VkNTQ3OGE3YjMwMjg5NzkzNTBhNC5wb3dlcnN5bmMuam91cm5leWFwcHMuY29tIiwiaHR0cHM6Ly9kZXYtMjBwenVpdnQwbGZvNWhoeS51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzQ5MTIwMjQ4LCJleHAiOjE3NDkyMDY2NDgsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhenAiOiJ2OVVQM1VTbWcwTnZ3WlRnSFRZS0NBT0ViT1VSWVNtRCJ9.ULbHw3EIC7kVq0PYxoNu6tKxcjrmuPyky6kZBbean2ke9LAKn6io5Jw6FqRaum6TKv0Cr-4S7WTtGsxoDqA4alro7b071P38dv-VOLUOduvwgWof8Dhjw_VO1bWZsp2AlQb5hlQmcPv8I6JkA1EtQbc8enzX3Of-wZA6KiXQHY71ZyfCw34-uxnJSG-_cn88rUUnRKyOH34AUJBqdJtGtCAcw8nSL3YIIga0oK5gKvghPSOE5EKQdtaqp7_LXpw_rQI8v-eKixgHpkPGiIv3B1am2tn05SwnEmXzni0fvdZpmp0MF_FntOiDnUEMsvOhRdIO8J7gfRN_deowEaFzKg'
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