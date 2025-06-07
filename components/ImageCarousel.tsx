import * as React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { CustomCarouselProps } from "@/interface/Slider";
 
const CustomCarousel = ({ data,width }: CustomCarouselProps) => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({

      count: index - progress.value,
      animated: true,
    });
  };

	return (
    <View style={styles.container}>
    <Carousel
      ref={ref}
      width={width}
      data={data}
      onProgressChange={progress}
      renderItem={({ index }) => (
        <View
          style={styles.carouselItem}
        >
          <Animated.Image 
            source={data[index].image}
            style={styles.image}
            />

          
        </View>
      )}
    />

    <Pagination.Basic
      progress={progress}
      data={data}
      dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
      containerStyle={{ gap: 5, marginTop: 10 }}
      onPress={onPressPagination}
    />
  </View>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
 
  },
  carouselItem: {
    flex: 1,
    
    justifyContent: "center",
    alignItems: "center",

  },
  image:{
    width: "100%", height: "90%",  resizeMode:"contain",
    borderRadius: 25,
  }
 
});
 
export default CustomCarousel;
 