// app/components/MiddlePanel.tsx
import React from "react";

interface MiddlePanelProps {
  hiddenLayers: number[];
  weights: number[][][];
}

const MiddlePanel: React.FC<MiddlePanelProps> = ({ hiddenLayers, weights }) => {
  const inputNeurons = 2; // For simplicity (X, Y)
  const outputNeurons = 1;

  const allLayers = [inputNeurons, ...hiddenLayers, outputNeurons];

  return (
    <div className="flex justify-center overflow-x-auto mt-6">
      <svg width={allLayers.length * 150} height={300}>
        {allLayers.map((neuronCount, layerIndex) => {
          const x = layerIndex * 150;

          return Array.from({ length: neuronCount }).map((_, neuronIndex) => {
            const y = 50 + neuronIndex * 60;

            // Draw neuron as circle
            return (
              <circle
                key={`L${layerIndex}-N${neuronIndex}`}
                cx={x}
                cy={y}
                r={15}
                fill="#60A5FA"
                stroke="black"
              />
            );
          });
        })}

        {/* Draw connections */}
        {weights.map((layerWeights, layerIndex) => {
          return layerWeights.map((fromWeights, fromIndex) => {
            return fromWeights.map((weight, toIndex) => {
              const x1 = layerIndex * 150;
              const y1 = 50 + fromIndex * 60;
              const x2 = (layerIndex + 1) * 150;
              const y2 = 50 + toIndex * 60;

              return (
                <line
                  key={`L${layerIndex}-${fromIndex}->${toIndex}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="black"
                  strokeWidth={Math.abs(weight) * 5}
                  strokeOpacity={0.5}
                />
              );
            });
          });
        })}
      </svg>
    </div>
  );
};

export default MiddlePanel;