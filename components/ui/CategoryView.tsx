import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface CategoryViewProps {
  header: string;
  children: React.ReactNode;
  headerStyle?: object;
  containerStyle?: object;
}

const CategoryView: React.FC<CategoryViewProps> = ({
  header,
  children,
  headerStyle,
  containerStyle,
}) => {
  const {theme} = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={[styles.category, containerStyle]}>
      <View style={styles.categoryHeader}>
        <Text style={[styles.headerText, headerStyle]}>{header}</Text>
      </View>
      <View style={styles.categoryContent}>{children}</View>
    </View>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  category: {
    flexDirection: "column",
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerText: {
    fontSize: 18,
    fontFamily: "Roboto-Bold",
    color: theme.text,
  },
  categoryContent: {
    flexDirection: "column",
    gap: 10,
  },
  
});

export default CategoryView;