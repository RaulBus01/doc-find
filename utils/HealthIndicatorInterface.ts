export const healthIndicatorConfig = {
    diabetic: {
      labelKey: 'healthIndicators.diabetic',
      label: 'Diabetic',
      icon: 'syringe',
    },
    hypertensive: {
      labelKey: 'healthIndicators.hypertensive',
      label: 'Hypertensive',
      icon: 'heartbeat',
    },
    smoker: {
      labelKey: 'healthIndicators.smoker',
      label: 'Smoker',
      icon: 'smoking',
    },
    
  };
  


  export const getHealthIndicatorLabel = (key: keyof typeof healthIndicatorConfig, t: (key: string) => string) => {
  return t(healthIndicatorConfig[key].labelKey);
};
export const healthIndicatorValueKeys = {
  'Yes': 'healthIndicatorValues.Yes',
  'No': 'healthIndicatorValues.No',
  'I don\'t know': 'healthIndicatorValues.I don\'t know',
  'I used to': 'healthIndicatorValues.I used to'
} as const;

export const getHealthIndicatorValue = (value: keyof typeof healthIndicatorValueKeys, t: (key: string) => string) => {
  return t(healthIndicatorValueKeys[value]);
};

export const genderValueKeys = {
  'Male':'gender.Male',
  'Female':'gender.Female',
}
export const getGenderValue = (value: keyof typeof genderValueKeys, t: (key: string) => string) => {
  return t(genderValueKeys[value]);
};
