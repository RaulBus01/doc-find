import { ThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

interface CustomModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onCanceled?: () => void;
  onConfirmed?: () => void;
  modalMessage: string;
  modalTitle: string;
  
}

const CustomModal: React.FC<CustomModalProps> = ({ modalVisible, setModalVisible, modalMessage,modalTitle,onConfirmed }) => {
   const { theme } = useTheme();
    const styles = getStyles(theme);
  if (!modalVisible) return null;
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          

          <View style={styles.centeredView}>
           
            <View style={styles.modalView}>
              
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <Text style={styles.modalText}>{modalMessage}</Text>
              <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Cancel </Text>

              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  if (onConfirmed) onConfirmed();
                }}>
                <Text style={styles.textStyle}>Confirm</Text>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
       
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const getStyles = (theme: ThemeColors) => StyleSheet.create({

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    color: theme.text,
  },
  modalView: {

    margin: 20,
    backgroundColor: theme.background,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    color: theme.text
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: theme.red,
  },
  buttonClose: {
    backgroundColor: theme.blue,
  },
  textStyle: {
    color: theme.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: theme.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default CustomModal;