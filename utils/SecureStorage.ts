import * as SecureStore from 'expo-secure-store';

async function secureSave(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function secureSaveObject(key: string, value: any): Promise<void> {
  // Ensure value is properly converted to a string
  const valueToStore = typeof value === 'string' 
    ? value 
    : JSON.stringify(value);
    
  return await SecureStore.setItemAsync(key, valueToStore);
}

async function secureGetValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

async function secureDeleteValue(key: string) {
  return await SecureStore.deleteItemAsync(key);
}

export { secureSave, secureGetValueFor, secureDeleteValue};