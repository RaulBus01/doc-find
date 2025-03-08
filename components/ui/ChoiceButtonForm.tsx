import { TouchableOpacity,Text,StyleSheet } from "react-native";



const ChoiceButton = ({ choice, selected, onPress, theme }) => (
    
  <TouchableOpacity
    style={[
      styles.genderButton,
      selected && styles.selectedGender,
    ]}
    onPress={onPress}
  >
    <Text style={[
      styles.genderText,
      selected && styles.selectedGenderText,
    ]}>{choice}</Text>
  </TouchableOpacity>
);

export default ChoiceButton;

const getStyles = (theme) => StyleSheet.create({
    genderButton: {
      backgroundColor: theme.textlight,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginHorizontal: 5,
    }
    selectedGender: {
      backgroundColor: theme.tint,
    },

