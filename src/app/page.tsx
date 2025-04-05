"use client";
import { useState } from "react";
import { FaRedoAlt, FaPlay, FaForward } from "react-icons/fa";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const [epoch, setEpoch] = useState<number>(100);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [learningRate, setLearningRate] = useState<number>(0.03);
  const [activation, setActivation] = useState<string>("Tanh");
  const [regularisation, setRegularisation] = useState<string>("None");
  const [regularisationRate, setRegularisationRate] = useState<number>(0);
  const [problemType, setProblemType] = useState<string>("Classification");

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
        <section className="flex-1 bg-gray-800 p-6 border-r border-gray-700">
          <h2 className="text-xl font-medium mb-2">Panel 1</h2>
          <p>Content for the first panel.</p>
        </section>

        <section className="flex-1 bg-gray-700 p-6 border-r border-gray-600">
          <h2 className="text-xl font-medium mb-2">Panel 2</h2>
          <p>Content for the second panel.</p>
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