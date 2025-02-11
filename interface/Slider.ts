import { ImageSourcePropType } from "react-native";

interface CustomCarouselItem {
  id: string;
  title: string;
  image: ImageSourcePropType;
}

interface CustomCarouselProps {
  data: CustomCarouselItem[];
  width: number;
}

export { CustomCarouselProps, CustomCarouselItem };