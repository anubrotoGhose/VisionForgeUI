export const serializeNetwork = (
    features: { name: string; selected: boolean }[],
    hiddenLayers: { id: number; neurons: number; activation: string }[],
    numOutputNeurons: number
  ) => {
    return {
      inputFeatures: features.filter(f => f.selected).map(f => f.name),
      hiddenLayers,
      outputNeurons: numOutputNeurons
    };
  };  