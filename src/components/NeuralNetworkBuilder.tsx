import React, { useState } from "react";

const ACTIVATION_FUNCTIONS = ["ReLU", "Tanh", "Sigmoid", "Linear", "Custom"];

type Layer = {
  id: number;
  neurons: number;
  activation: string;
};

const NeuralNetworkBuilder = ({ columnNames }: { columnNames: string[] }) => {
  const [features, setFeatures] = useState(
    columnNames.slice(0, columnNames.length - 1).map((name) => ({
      name: name.slice(0, 10),
      selected: true,
    }))
  );

  const [hiddenLayers, setHiddenLayers] = useState<Layer[]>([
    { id: 1, neurons: 4, activation: "Tanh" },
    { id: 2, neurons: 2, activation: "Tanh" },
  ]);

  const addLayer = () => {
    const newId = hiddenLayers.length
      ? hiddenLayers[hiddenLayers.length - 1].id + 1
      : 1;
    setHiddenLayers([...hiddenLayers, { id: newId, neurons: 1, activation: "Tanh" }]);
  };

  const removeLayer = () => {
    if (hiddenLayers.length > 0) {
      setHiddenLayers(hiddenLayers.slice(0, -1));
    }
  };

  const toggleFeature = (index: number) => {
    setFeatures((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, selected: !f.selected } : f
      )
    );
  };

  const addNeuron = (id: number) => {
    setHiddenLayers((prev) =>
      prev.map((layer) =>
        layer.id === id ? { ...layer, neurons: layer.neurons + 1 } : layer
      )
    );
  };

  const removeNeuron = (id: number) => {
    setHiddenLayers((prev) =>
      prev
        .map((layer) =>
          layer.id === id ? { ...layer, neurons: layer.neurons - 1 } : layer
        )
        .filter((layer) => layer.neurons > 0)
    );
  };

  const setActivation = (id: number, value: string) => {
    setHiddenLayers((prev) =>
      prev.map((layer) =>
        layer.id === id ? { ...layer, activation: value } : layer
      )
    );
  };

  return (
    <section className="flex-1 bg-gray-700 p-6 border-r border-gray-600 overflow-auto">
      <div className="flex justify-between mb-4">
        <button onClick={addLayer} className="bg-green-500 px-2 py-1 rounded text-white">+ Layer</button>
        <button onClick={removeLayer} className="bg-red-500 px-2 py-1 rounded text-white">- Layer</button>
      </div>

      <div className="flex gap-12 items-start overflow-x-auto">
        {/* Feature Inputs */}
        <div className="flex flex-col items-center">
          <h3 className="text-white mb-2">Features</h3>
          {features.map((f, idx) => (
            <div
              key={idx}
              onClick={() => toggleFeature(idx)}
              className={`flex items-center gap-2 mb-2 cursor-pointer ${
                f.selected ? "opacity-100" : "opacity-40"
              }`}
            >
              <span className="text-white text-sm w-20 truncate text-right">{f.name}</span>
              <div className="w-6 h-6 bg-blue-400 rounded-full border-2 border-white"></div>
            </div>
          ))}
        </div>

        {/* Hidden Layers */}
        {hiddenLayers.map((layer) => (
          <div key={layer.id} className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => addNeuron(layer.id)} className="text-green-300">+</button>
              <button onClick={() => removeNeuron(layer.id)} className="text-red-300">-</button>
            </div>
            {[...Array(layer.neurons)].map((_, i) => (
              <div key={i} className="w-6 h-6 bg-purple-400 rounded-full border-2 border-white mb-2"></div>
            ))}
            <label className="text-white text-sm mt-2">Activation:</label>
            <select
              value={layer.activation}
              onChange={(e) => setActivation(layer.id, e.target.value)}
              className="text-sm p-1 mt-1 rounded"
            >
              {ACTIVATION_FUNCTIONS.map((fn) => (
                <option key={fn} value={fn}>
                  {fn}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Output Layer */}
        <div className="flex flex-col items-center">
          <h3 className="text-white mb-2">Output</h3>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white mb-2"></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NeuralNetworkBuilder;