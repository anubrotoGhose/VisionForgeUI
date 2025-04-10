"use client";
import { useState, useRef } from "react";
import { FaRedoAlt, FaPlay, FaPause, FaForward } from "react-icons/fa";
import type { NextPage } from "next";
import NeuralNetworkBuilder from "@/components/NeuralNetworkBuilder";
import { saveAs } from 'file-saver';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Home: NextPage = () => {
  const [epoch, setEpoch] = useState<number>(100);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [learningRate, setLearningRate] = useState<number>(0.03);
  const [optimizer, setOptimzer] = useState<string>("SGD");
  const [regularisation, setRegularisation] = useState<string>("None");
  const [regularisationRate, setRegularisationRate] = useState<number>(0);
  const [problemType, setProblemType] = useState<string>("Classification-Single");

  // play pause button state
  // const [isPlaying, setIsPlaying] = useState(false);
  // const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // left panel
  const [useTrainingAsTesting, setUseTrainingAsTesting] = useState(true);
  const [trainTestRatio, setTrainTestRatio] = useState(0.8);
  const [batchSize, setBatchSize] = useState(10);

  // store content
  const [trainingData, setTrainingData] = useState<Array<Record<string, any>>>([]);
  const [testingData, setTestingData] = useState<Array<Record<string, any>>>([]);


  // for maintaining list of features
  const [columnTrainingNames, setcolumnTrainingNames] = useState<string[]>([]);

  const [columnTestingNames, setcolumnTestingNames] = useState<string[]>([]);

  const [featureVectorNames, setfeatureVectorNames] = useState<string[]>([]);

  // for output neurons
  const [numOutputNeurons, setNumOutputNeurons] = useState<number | null>(null);


  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);

  const [modelResults, setModelResults] = useState<any>(null);


  // const handlePlay = () => {
  //   if (isPlaying) {
  //     // Pause the loop
  //     timeoutRefs.current.forEach(clearTimeout);
  //     timeoutRefs.current = [];
  //     setIsPlaying(false);
  //     return;
  //   }

  //   // Play from current stage to epoch
  //   setIsPlaying(true);

  //   for (let i = currentStage + 1; i <= epoch; i++) {
  //     const timeout = setTimeout(() => {
  //       setCurrentStage(i);

  //       if (i === epoch) {
  //         setIsPlaying(false); // Stop at the end
  //       }
  //     }, (i - currentStage) * 50);

  //     timeoutRefs.current.push(timeout);
  //   }
  // };


  // const handleReset = () => {
  //   timeoutRefs.current.forEach(clearTimeout); // stop any running loop
  //   timeoutRefs.current = [];
  //   setCurrentStage(0);
  //   setIsPlaying(false);
  // };


  const handleSkip = () => {
    setCurrentStage((prev) => Math.min(prev + 1, epoch));
  };

  const handleGetTrainingTargetVectors = async (
    file: File,
    targetColumns: string,
    taskType: string
  ): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_columns", targetColumns); // comma-separated
    formData.append("task_type", taskType);

    try {
      const response = await fetch("http://localhost:8000/get-target-vectors", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setNumOutputNeurons(result.num_output_neurons);

      } else {
        console.error("Error from API:", result.error);
      }
    } catch (err) {
      console.error("Failed to fetch target vectors:", err);
    }
  };

  //left panel
  const handleTrainingDataUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:8000/upload-training-data", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setcolumnTrainingNames(result.column_names);

          // Save content if needed
          setTrainingData(result.content);


          setUploadedFile(file);
        } else {
          console.error("Upload failed:", response.statusText);
        }
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }
  };


  console.log("Training data:", trainingData);

  const handleTestingDataUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file); // "file" must match FastAPI parameter name

      try {
        const response = await fetch("http://localhost:8000/upload-testing-data", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log("File uploaded successfully:", result);

          console.log("Column Names:", result.column_names);
          setcolumnTestingNames(result.column_names);

          setTestingData(result.content);
          console.log("Training data:", testingData);

        } else {
          console.error("Upload failed:", response.statusText);
        }
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }
  };


  const columnsMatch =
    columnTrainingNames.length > 0 &&
    columnTestingNames.length > 0 &&
    columnTrainingNames.length === columnTestingNames.length &&
    columnTrainingNames.every((name, idx) => name === columnTestingNames[idx]);

  const handleModelTrained = (results: any) => {
    setModelResults(results);
    // Optionally scroll to results or show a notification
  };

  const handleDownloadModel = async () => {
    try {
      const response = await fetch("http://localhost:8000/modeldownload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modelResults.model_structure), // pass model_structure
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const blob = await response.blob();
      saveAs(blob, "complete_model.pth");
    } catch (error) {
      console.error("Error downloading model:", error);
      alert("Error downloading model. See console for details.");
    }
  };

  const handleDownloadWeights = async () => {
    try {
      const response = await fetch("http://localhost:8000/modelweight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modelResults.model_structure), // pass model_structure
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const blob = await response.blob();
      saveAs(blob, "model_weights.pth");
    } catch (error) {
      console.error("Error downloading weights:", error);
      alert("Error downloading weights. See console for details.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark bg-gray-900 text-white">
      <div className="bg-gray-900 text-white px-6 py-2 text-lg font-semibold shadow-md">
        VisionForge
      </div>
      {/* Top Bar with Controls */}
      <header className="bg-gray-800 p-4 shadow-md">

        <div className="flex flex-wrap items-center gap-4">
          {/* Control Buttons */}
          {/* <div className="flex gap-2">
            <button
              onClick={handlePlay}
              className={`${isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                } px-4 py-2 rounded flex items-center gap-1`}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
              {isPlaying ? "Pause" : "Play"}
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
          </div> */}

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
          {/* <div className="text-sm">
            Stage: <span className="font-bold">{currentStage}</span> / {epoch}
          </div> */}

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

          {/* Optimzer Function */}
          <div>
            <label className="block text-sm">Optimizer:</label>
            <select
              value={optimizer}
              onChange={(e) => setOptimzer(e.target.value)}
              className="bg-gray-700 px-3 py-1 rounded"
            >
              <option>SGD</option>
              <option>Adam</option>
              <option>AdamW</option>
              <option>RMSprop</option>
              <option>Adagrad</option>
              <option>Adadelta</option>
              <option>ASGD</option>
              <option>LBFGS</option>
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
              <option>Classification-Single</option>
              <option>Classification-Multilabel</option>
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

          {useTrainingAsTesting && (
            <div className="mb-4">
              <label className="text-sm block mb-1">
                Train/Test Ratio: {(trainTestRatio * 100).toFixed(0)}% Train / {(100 - trainTestRatio * 100).toFixed(0)}% Test
              </label>
              <input
                type="range"
                min={0.5}
                max={0.95}
                step={0.01}
                value={trainTestRatio}
                onChange={(e) => setTrainTestRatio(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          {/* 🆕 Target Column Selector */}
          {uploadedFile && columnTrainingNames.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-white mb-2">
                Select target {problemType === "classification-single" ? "column" : "columns"}:
              </label>
              <div className="flex flex-wrap gap-2">
                {columnTrainingNames.map((col) => (
                  <label key={col} className="flex items-center gap-1 text-sm text-white">
                    <input
                      type={problemType === "classification-single" ? "radio" : "checkbox"}
                      name="targetColumn"
                      value={col}
                      checked={selectedTargets.includes(col)}
                      onChange={(e) => {
                        if (problemType === "classification-single") {
                          setSelectedTargets([col]);
                        } else {
                          setSelectedTargets((prev) =>
                            e.target.checked ? [...prev, col] : prev.filter((c) => c !== col)
                          );
                        }
                      }}
                    />
                    {col}
                  </label>
                ))}
              </div>



              {/* Column Match Message */}
              {!useTrainingAsTesting && (
                <div className="mt-4">
                  {columnTrainingNames.length > 0 && columnTestingNames.length > 0 && (
                    <div
                      className={`text-sm font-medium px-3 py-2 rounded ${columnsMatch ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {columnsMatch
                        ? "✅ Column names match between training and testing data."
                        : "❌ Column names do not match!"}
                    </div>
                  )}
                </div>
              )}

              <button
                className="mt-4 bg-blue-600 text-white px-3 py-1 rounded"
                disabled={selectedTargets.length === 0}
                onClick={async () => {
                  if (uploadedFile) {
                    await handleGetTrainingTargetVectors(
                      uploadedFile,
                      selectedTargets.join(","),
                      problemType
                    );

                    // ✅ Set feature vector names excluding selected targets
                    setfeatureVectorNames([
                      ...columnTrainingNames.filter((col) => !selectedTargets.includes(col))
                    ]);

                  }
                }}
              >
                Confirm Target Column(s)
              </button>


            </div>
          )}

          <div className="mb-4">
            <label className="text-sm block mb-1">Batch Size</label>
            <input
              type="number"
              min={1}
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        </section>


        {/* <section className="flex-1 bg-gray-700 p-6 border-r border-gray-600">
          <h2 className="text-xl font-medium mb-2">Panel 2</h2>
          <p>Content for the second panel.</p>
        </section> */}

        <section className="flex-1 bg-gray-700 p-6 border-r border-gray-600 overflow-auto">
          <h2 className="text-xl font-medium mb-2">Neural Network Builder</h2>
          {featureVectorNames.length > 0 ? (
            <NeuralNetworkBuilder
              featureColumnNames={featureVectorNames}
              targetColumns={columnTrainingNames.filter(name => !featureVectorNames.includes(name))}
              numOutputNeurons={numOutputNeurons ?? 2}
              epoch={epoch}
              learningRate={learningRate}
              optimizer={optimizer}
              regularisation={regularisation}
              regularisationRate={regularisationRate}
              useTrainingAsTesting={useTrainingAsTesting}
              trainTestRatio={trainTestRatio}
              batchSize={batchSize}
              problemType={problemType} // fallback to 2 if not loaded
              trainingData={trainingData}
              testingData={testingData}
              onModelTrained={handleModelTrained}
            />
          ) : (
            <p className="text-gray-300">Upload training data to start building the network.</p>
          )}
        </section>


        <section className="flex-1 bg-gray-600 p-6">
          <h2 className="text-xl font-medium mb-2">Output</h2>
          {modelResults && modelResults.loss_over_epochs && (
            <div className="mt-4">
              <h4 className="text-md font-medium text-gray-200">Loss Over Epochs</h4>
              <div className="h-60 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={modelResults.loss_over_epochs.map((loss: number, index: number) => ({
                      epoch: index + 1,
                      loss,
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="epoch" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="loss"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {/* Test Loss */}
              {modelResults.test_loss && (
                <p className="mt-2 text-gray-300">
                  📉 <span className="font-medium">Test Loss:</span> {modelResults.test_loss}
                </p>
              )}
            </div>
          )}

          {/* Download buttons */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleDownloadModel}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PyTorch Model
            </button>

            <button
              onClick={handleDownloadWeights}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Model Weights
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;