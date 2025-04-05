"use client";
import { useState } from "react";
import { FaRedoAlt, FaPlay, FaForward } from "react-icons/fa";
import type { NextPage } from "next";
import NeuralNetworkBuilder from "@/components/NeuralNetworkBuilder";

const Home: NextPage = () => {
  const [epoch, setEpoch] = useState<number>(100);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [learningRate, setLearningRate] = useState<number>(0.03);
  const [activation, setActivation] = useState<string>("Tanh");
  const [regularisation, setRegularisation] = useState<string>("None");
  const [regularisationRate, setRegularisationRate] = useState<number>(0);
  const [problemType, setProblemType] = useState<string>("Classification");

  // left panel
  const [useTrainingAsTesting, setUseTrainingAsTesting] = useState(true);
  const [trainTestRatio, setTrainTestRatio] = useState(0.8);
  const [batchSize, setBatchSize] = useState(10);

  // for maintaining list of features
  const [columnNames, setColumnNames] = useState<string[]>([]);

  const handlePlay = () => {
    setCurrentStage(0);
    for (let i = 1; i <= epoch; i++) {
      setTimeout(() => {
        setCurrentStage(i);
      }, i * 50); // Slow down the loop for UI feedback
    }
  };

  const handleReset = () => {
    setCurrentStage(0);
  };

  const handleSkip = () => {
    setCurrentStage((prev) => Math.min(prev + 1, epoch));
  };

  //left panel
  const handleTrainingDataUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file); // "file" must match FastAPI parameter name

      try {
        const response = await fetch("http://localhost:8000/upload-training-data", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log("File uploaded successfully:", result);

          console.log("Column Names:", result.column_names);
          setColumnNames(result.column_names);

        } else {
          console.error("Upload failed:", response.statusText);
        }
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }
  };


  const handleTestingDataUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle testing file logic
      console.log(file.name)
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark bg-gray-900 text-white">
      <div className="bg-gray-900 text-white px-6 py-2 text-lg font-semibold shadow-md">
        NetMaker
      </div>
      {/* Top Bar with Controls */}
      <header className="bg-gray-800 p-4 shadow-md">

        <div className="flex flex-wrap items-center gap-4">
          {/* Control Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handlePlay}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center gap-1"
            >
              <FaPlay />
              Play
            </button>
            <button
              onClick={handleReset}
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded flex items-center gap-1"
            >
              <FaRedoAlt />
              Reset
            </button>
            <button
              onClick={handleSkip}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-1"
            >
              <FaForward />
              Skip
            </button>
          </div>

          {/* Epoch Input and Stage Display */}
          <div>
            <label className="block text-sm">Epoch:</label>
            <input
              type="number"
              value={epoch}
              onChange={(e) => setEpoch(parseInt(e.target.value))}
              className="bg-gray-700 px-3 py-1 rounded w-20"
            />
          </div>
          <div className="text-sm">
            Stage: <span className="font-bold">{currentStage}</span> / {epoch}
          </div>

          {/* Learning Rate */}
          <div>
            <label className="block text-sm">Learning Rate:</label>
            <input
              type="number"
              step="0.001"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="bg-gray-700 px-3 py-1 rounded w-24"
            />
          </div>

          {/* Activation Function */}
          <div>
            <label className="block text-sm">Activation:</label>
            <select
              value={activation}
              onChange={(e) => setActivation(e.target.value)}
              className="bg-gray-700 px-3 py-1 rounded"
            >
              <option>ReLU</option>
              <option>Tanh</option>
              <option>Sigmoid</option>
              <option>Linear</option>
              <option>Custom</option>
            </select>
          </div>

          {/* Regularisation */}
          <div>
            <label className="block text-sm">Regularisation:</label>
            <select
              value={regularisation}
              onChange={(e) => setRegularisation(e.target.value)}
              className="bg-gray-700 px-3 py-1 rounded"
            >
              <option>None</option>
              <option>L1</option>
              <option>L2</option>
            </select>
          </div>

          {/* Regularisation Rate */}
          <div>
            <label className="block text-sm">Reg. Rate:</label>
            <input
              type="number"
              step="0.001"
              value={regularisationRate}
              onChange={(e) => setRegularisationRate(parseFloat(e.target.value))}
              className="bg-gray-700 px-3 py-1 rounded w-24"
            />
          </div>

          {/* Problem Type */}
          <div>
            <label className="block text-sm">Problem Type:</label>
            <select
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
              className="bg-gray-700 px-3 py-1 rounded"
            >
              <option>Classification</option>
              <option>Regression</option>
            </select>
          </div>
        </div>
      </header>

      {/* Three Panels */}
      <main className="flex flex-1">
        <section className="flex-1 bg-gray-800 p-6 border-r border-gray-700 text-white">
          <h2 className="text-xl font-medium mb-4">Data Controls</h2>

          {/* Upload Buttons */}
          <div className="flex flex-col gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">Training Data:</label>
              <input
                type="file"
                accept=".csv, .tsv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleTrainingDataUpload}
                className="bg-gray-700 px-3 py-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Testing Data:</label>
              <input
                type="file"
                accept=".csv, .tsv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleTestingDataUpload}
                disabled={useTrainingAsTesting}
                className={`bg-gray-700 px-3 py-2 rounded w-full ${useTrainingAsTesting ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>

          {/* Checkbox to use training data as testing data */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={useTrainingAsTesting}
              onChange={() => setUseTrainingAsTesting(!useTrainingAsTesting)}
              className="accent-blue-500"
            />
            <label className="text-sm">Use training data as testing data</label>
          </div>

          {/* Ratio Slider */}
          <div className={`mb-4 ${useTrainingAsTesting ? '' : 'opacity-50 pointer-events-none'}`}>
            <label className="block text-sm mb-1">Train/Test Ratio: {trainTestRatio}</label>
            <input
              type="range"
              min={0.1}
              max={0.9}
              step={0.05}
              value={trainTestRatio}
              onChange={(e) => setTrainTestRatio(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Batch Size */}
          <div>
            <label className="block text-sm mb-1">Batch Size:</label>
            <input
              type="number"
              min={1}
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value))}
              className="bg-gray-700 px-3 py-2 rounded w-full"
            />
          </div>
        </section>


        {/* <section className="flex-1 bg-gray-700 p-6 border-r border-gray-600">
          <h2 className="text-xl font-medium mb-2">Panel 2</h2>
          <p>Content for the second panel.</p>
        </section> */}

        <section className="flex-1 bg-gray-700 p-6 border-r border-gray-600 overflow-auto">
          <h2 className="text-xl font-medium mb-2">Neural Network Builder</h2>
          {columnNames.length > 0 ? (
            <NeuralNetworkBuilder columnNames={columnNames} />
          ) : (
            <p className="text-gray-300">Upload training data to start building the network.</p>
          )}
        </section>

        <section className="flex-1 bg-gray-600 p-6">
          <h2 className="text-xl font-medium mb-2">Panel 3</h2>
          <p>Content for the third panel.</p>
        </section>
      </main>
    </div>
  );
};

export default Home;