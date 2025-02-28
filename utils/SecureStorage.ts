import * as SecureStore from 'expo-secure-store';

async function secureSave(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function secureSaveObject(key: string, data: any) {
  try {
    const userString = JSON.stringify(data);
    await SecureStore.setItemAsync(key, userString);
  } catch (error) {
    console.error('Error saving user object:', error);
  }
}
async function secureGetValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

async function deleteValue(key: string) {
  await SecureStore.deleteItemAsync(key);
}


export { secureSave, secureSaveObject, secureGetValueFor, deleteValue};