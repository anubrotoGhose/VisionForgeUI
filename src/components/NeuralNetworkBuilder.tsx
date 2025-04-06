import React, { useState, useRef, useEffect, JSX } from "react";

const ACTIVATION_FUNCTIONS = ["ReLU", "Tanh", "Sigmoid", "Linear", "Custom"];

type Layer = {
  id: number;
  neurons: number;
  activation: string;
};

const NeuralNetworkBuilder = ({
  columnNames,
  numOutputNeurons,
}: {
  columnNames: string[];
  numOutputNeurons: number;
}) => {
  const [features, setFeatures] = useState(
    columnNames.map((name) => ({
      name: name.slice(0, 10),
      selected: true,
    }))
  );

  useEffect(() => {
    const freshFeatures = columnNames.map((name) => ({
      name: name.slice(0, 10),
      selected: true,
    }));
    setFeatures(freshFeatures);
  }, [columnNames]);

  const [hiddenLayers, setHiddenLayers] = useState<Layer[]>([
    { id: 1, neurons: 4, activation: "Tanh" },
    { id: 2, neurons: 2, activation: "Tanh" },
  ]);

  const [svgLines, setSvgLines] = useState<JSX.Element[]>([]);
  const neuronRefs = useRef<{ [layerIndex: number]: HTMLDivElement[] }>({});

  useEffect(() => {
    neuronRefs.current = {};
  }, [features, hiddenLayers]);

  const addLayer = () => {
    const newId = hiddenLayers.length
      ? hiddenLayers[hiddenLayers.length - 1].id + 1
      : 1;
    setHiddenLayers([
      ...hiddenLayers,
      { id: newId, neurons: 1, activation: "Tanh" },
    ]);
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
          layer.id === id
            ? { ...layer, neurons: layer.neurons - 1 }
            : layer
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

  const updateConnections = () => {
    const connections: JSX.Element[] = [];

    const allLayers = [
      features.filter((f) => f.selected).length,
      ...hiddenLayers.map((l) => l.neurons),
      numOutputNeurons,
    ];

    for (let l = 0; l < allLayers.length - 1; l++) {
      const fromNeurons = neuronRefs.current[l] || [];
      const toNeurons = neuronRefs.current[l + 1] || [];

      fromNeurons.forEach((fromEl, i) => {
        if (!fromEl) return;
        const fromRect = fromEl.getBoundingClientRect();

        toNeurons.forEach((toEl, j) => {
          if (!toEl) return;
          const toRect = toEl.getBoundingClientRect();

          const svg = document.querySelector("svg");
          if (!svg) return;
          const svgRect = svg.getBoundingClientRect();

          const x1 = fromRect.left + fromRect.width / 2 - svgRect.left;
          const y1 = fromRect.top + fromRect.height / 2 - svgRect.top;
          const x2 = toRect.left + toRect.width / 2 - svgRect.left;
          const y2 = toRect.top + toRect.height / 2 - svgRect.top;

          const weight = (Math.random() * 2 - 1).toFixed(2);
          const color = parseFloat(weight) >= 0 ? "limegreen" : "purple";

          connections.push(
            <line
              key={`${l}-${i}-${j}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={1.5}
            >
              <title>Weight: {weight}</title>
            </line>
          );
        });
      });
    }

    setSvgLines(connections);
  };

  useEffect(() => {
    updateConnections();
    window.addEventListener("resize", updateConnections);
    return () => window.removeEventListener("resize", updateConnections);
  }, [features, hiddenLayers]);

  return (
    <section className="relative flex-1 bg-gray-700 p-6 border-r border-gray-600 overflow-auto">
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {svgLines}
      </svg>

      <div className="flex justify-between mb-4 z-10 relative">
        <button
          onClick={addLayer}
          className="bg-green-500 px-2 py-1 rounded text-white"
        >
          + Layer
        </button>
        <button
          onClick={removeLayer}
          className="bg-red-500 px-2 py-1 rounded text-white"
        >
          - Layer
        </button>
      </div>

      <div className="flex gap-12 items-start overflow-x-auto z-10 relative">
        {/* Feature Inputs */}
        <div className="flex flex-col items-center min-w-[100px]">
          <h3 className="text-white mb-2">Features</h3>
          {features.map((f, idx) => (
            <div
              key={idx}
              onClick={() => toggleFeature(idx)}
              className={`flex items-center gap-2 mb-2 cursor-pointer ${
                f.selected ? "opacity-100" : "opacity-40"
              }`}
            >
              <span className="text-white text-sm w-20 truncate text-right">
                {f.name}
              </span>
              <div
                className="w-6 h-6 bg-blue-400 rounded-full border-2 border-white"
                ref={(el) => {
                  if (!neuronRefs.current[0]) neuronRefs.current[0] = [];
                  if (el) neuronRefs.current[0][idx] = el;
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Hidden Layers */}
        {hiddenLayers.map((layer, layerIdx) => {
          const index = layerIdx + 1;
          return (
            <div key={layer.id} className="flex flex-col items-center min-w-[100px]">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => addNeuron(layer.id)} className="text-green-300">+</button>
                <button onClick={() => removeNeuron(layer.id)} className="text-red-300">-</button>
              </div>
              {[...Array(layer.neurons)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 bg-purple-400 rounded-full border-2 border-white mb-2"
                  ref={(el) => {
                    if (!neuronRefs.current[index]) neuronRefs.current[index] = [];
                    if (el) neuronRefs.current[index][i] = el;
                  }}
                ></div>
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
          );
        })}

        {/* Output Layer */}
        <div className="flex flex-col items-center min-w-[100px]">
          <h3 className="text-white mb-2">Output</h3>
          {[...Array(numOutputNeurons)].map((_, i) => (
            <div
              key={i}
              className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white mb-2"
              ref={(el) => {
                const index = hiddenLayers.length + 1;
                if (!neuronRefs.current[index]) neuronRefs.current[index] = [];
                if (el) neuronRefs.current[index][i] = el;
              }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NeuralNetworkBuilder;