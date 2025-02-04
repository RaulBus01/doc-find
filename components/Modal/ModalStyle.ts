import { StyleSheet } from "react-native";


const ModalStyle = StyleSheet.create({
    safeArea: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.5)'
         
    },
    container: {
        width:'90%',
        
        backgroundColor:'white',
        borderRadius:20,
        padding:20,
        alignItems:'center',
         
    },
    
    buttonContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:'80%',
        paddingHorizontal:20,
        paddingTop:10,
        marginVertical:10
    }

})

export default ModalStyle;