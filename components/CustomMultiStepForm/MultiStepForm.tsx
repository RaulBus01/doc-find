import { View, Text, StyleSheet} from 'react-native';
import React, { ReactNode, useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native-gesture-handler';
import { ThemeColors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';


interface Step {
  key: string;
  title: string;
  component: ReactNode;
  validate?: () => boolean;
}

interface MultiStepFormProps {
  steps: Step[];
  currentStep: number;
  onComplete: (currentStep: number) => void;
  onNext: (currentStep: number) => void;
  onBack: (currentStep: number) => void;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  currentStep,
  onComplete,
  onNext,
  onBack,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const progressAnimated = useSharedValue(0);
  const contentOpacity = useSharedValue(1);
  const { t } = useTranslation();

  useEffect(() => {
    progressAnimated.value = withSpring((currentStep + 1) / steps.length, {
      damping: 15,
      stiffness: 100,
    });
  }, [currentStep, steps.length]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnimated.value * 100}%`,
    };
  });
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const handleNext = () => {
    const isValid = steps[currentStep].validate?.() ?? true;
    if (isValid) {
      if (currentStep < steps.length - 1) {
        contentOpacity.value = withSpring(0, { damping: 15, stiffness: 100, mass: 0.5, velocity: 2 }, (finished) => {
          if (finished) {
            runOnJS(onNext)(currentStep);
            contentOpacity.value = withSpring(1, {});
          }
        });
      } else {
        onComplete(currentStep);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      contentOpacity.value = withSpring(0, { damping: 15, stiffness: 100, mass: 0.5, velocity: 2 }, (finished) => {
        if (finished) {
          runOnJS(onBack)(currentStep);
          contentOpacity.value = withSpring(1, {});
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, animatedStyle]} />
        </View>
        <Text style={styles.stepIndicator}>
          {t('profileNew.profileStep')} {currentStep + 1} {t('profileNew.profileStepOf')} {steps.length}
        </Text>
      </View>

      <View style={styles.backButtonContainer}>
        <Pressable
          style={[styles.backButton, currentStep === 0 && styles.hiddenButton]}
          onPress={handleBack}
          disabled={currentStep === 0}
        >
          <Ionicons name="chevron-up-circle" size={24} color={theme.text} />
          <Text style={styles.buttonText}>{t('profileNew.profileButtonBack')}</Text>
        </Pressable>
      </View>

      {/* Step Content */}
      <Animated.View style={[styles.contentContainer, contentAnimatedStyle, ]}>
        {/* Step Title */}
        <Text style={styles.stepTitle}>{steps[currentStep]?.title}</Text>
        {steps[currentStep]?.component}
      </Animated.View>

      {/* Navigation Buttons - Always show the Next button */}
      <View style={styles.navigationContainer}>
        <Pressable
          style={[styles.navButton, styles.nextButton]}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentStep === steps.length - 1 ? t('profileNew.profileButtonSave') : t('profileNew.profileButtonNext')}
          </Text>
          <FontAwesome6 name="arrow-right-long" size={24} color={theme.text} />
        </Pressable>
      </View>
    </View>
  );
};

const getStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  backButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  progressBar: {
    height: 6, // Slightly taller
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // More subtle background
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden', // Ensure fill doesn't overflow
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.progressColor,
    borderRadius: 3,
  },
  stepIndicator: {
    color: theme.text,
    fontSize: 14,
    textAlign: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: theme.text,
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  backButton:{
    flexDirection: 'row',
    gap: 10,
    // backgroundColor: theme.tint,
    padding: 5,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    gap: 10,
    padding: 15,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  nextButton: {
    backgroundColor: theme.progressColor,
  },
  hiddenButton: {
    opacity: 0,
  },
  buttonText: {
    color: theme.text,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    
  },
});