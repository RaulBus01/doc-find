import { View, Text,StyleSheet} from 'react-native'
import React, { forwardRef, useCallback, useMemo } from 'react'
import BottomSheet, {BottomSheetBackdrop, BottomSheetModal, BottomSheetView} from "@gorhom/bottom-sheet"
import { Colors } from '@/constants/Colors';
import BottomSheetModalButton from './BottomSheetModalButton';

export type Ref = BottomSheetModal;
interface CustomBottomSheetModalProps {
  onDelete: () => void;
  onEdit: () => void;
}

const CustomBottomSheetModal = forwardRef<Ref, CustomBottomSheetModalProps>((props, ref) => {
  const { onDelete, onEdit } = props;
  const snapPoints = useMemo(() => ['20%', '25%'], []);
  
  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop 
      {...props} 
      enableTouchThrough={false} 
      appearsOnIndex={0} 
      disappearsOnIndex={-1}
    />
  ), []);

  return (
    <BottomSheetModal
      index={0}
      ref={ref}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      keyboardBehavior="interactive"
      handleIndicatorStyle={styles.handleIndicator}
      handleStyle={styles.handle}
      backgroundStyle={styles.container}
    >
      <BottomSheetView style={styles.content}>
        <BottomSheetModalButton 
          title="Delete" 
          icon="trash" 
          onPress={() => {
            onDelete();
            (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
          }} 
        />
        <BottomSheetModalButton 
          title="Edit" 
          icon="create-outline" 
          onPress={() => {
            onEdit();
            (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
          }} 
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});
const styles = StyleSheet.create({
    container:{
        flex:1,
        borderTopLeftRadius:16,
        borderTopRightRadius:16,
        backgroundColor:Colors.light.tint
    },
    handleIndicator:{
        backgroundColor:Colors.light.tint,
    },
    handle:{
        backgroundColor:Colors.light.background,
        borderTopLeftRadius:16,
        borderTopRightRadius:16,
    },
    content:{
        flex:1,
        flexDirection:'column',
        backgroundColor:Colors.light.tint
    }
})

export default CustomBottomSheetModal