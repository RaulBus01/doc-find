import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import ModalStyle from './ModalStyle';

import { TextInput } from 'react-native-gesture-handler';

type CustomModalProps = {
    visible: boolean;
    modalAction: string | null;
    onClose: () => void;
    onConfirm: () => void;
    onRequestClose: () => void;
}

const CustomModal = ({visible, modalAction,onClose, onConfirm, onRequestClose}: CustomModalProps  ) => {
    const [chatName, setChatName] = useState('');
    return (
    <Modal visible={visible} transparent={true} onRequestClose={onRequestClose} animationType='fade'
    statusBarTranslucent={true}>
     <View style={ModalStyle.safeArea}>
        <View style={ModalStyle.container}>
            <Text>{modalAction === 'delete' ? 'Are you sure you want to delete this chat?' : 'Type the new name of the chat'}</Text>
            {modalAction === 'rename' && (
                <TextInput
                  
                    placeholder='Chat name'
                    onChangeText={(text) => setChatName(text)}
                />
            )}

            <View style={ModalStyle.buttonContainer}>
                <TouchableOpacity onPress={onClose} >
                    <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onConfirm} >
                    <Text>{modalAction === 'delete' ? 'Delete' : 'Confirm'}</Text>
                </TouchableOpacity>
            </View>

        </View>
     </View>
     
      
    </Modal>
  )
}

export default CustomModal