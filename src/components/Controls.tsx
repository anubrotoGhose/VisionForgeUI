// import { useState } from "react";
// import axios from "axios";

// // Define prop types
// interface ControlsProps {
//   setOutput: (output: any) => void;
// }

// const Controls: React.FC<ControlsProps> = ({ setOutput }) => {
//   const [learningRate, setLearningRate] = useState<number>(0.03);
//   const [hiddenLayers, setHiddenLayers] = useState<number[]>([4, 2]);
//   const [activation, setActivation] = useState<string>("tanh");

//   // Function to train the model
//   const trainModel = async () => {
//     try {
//       const res = await axios.post("http://127.0.0.1:8000/train/", {
//         learning_rate: learningRate,
//         hidden_layers: hiddenLayers,
//         activation,
//         epochs: 1000,
//       });

//       console.log(res.data);
//       setOutput(res.data);
//     } catch (error) {
//       console.error("Error training model:", error);
//     }
//   };

//   return (
//     <div className="p-4 bg-gray-100 rounded-lg">
//       <h2 className="text-lg font-bold text-black">Model Controls</h2>
  
//       <label className="block mt-2 text-black">Learning Rate:</label>
//       <input
//         type="number"
//         step="0.01"
//         value={learningRate}
//         onChange={(e) => setLearningRate(parseFloat(e.target.value))}
//         className="border p-2 w-full text-black bg-white"
//       />
  
//       <label className="block mt-2 text-black">Hidden Layers:</label>
//       <input
//         type="text"
//         value={hiddenLayers.join(",")}
//         onChange={(e) => setHiddenLayers(e.target.value.split(",").map(Number))}
//         className="border p-2 w-full text-black bg-white"
//       />
  
//       <label className="block mt-2 text-black">Activation:</label>
//       <select
//         value={activation}
//         onChange={(e) => setActivation(e.target.value)}
//         className="border p-2 w-full text-black bg-white"
//       >
//         <option value="tanh">Tanh</option>
//         <option value="relu">ReLU</option>
//         <option value="sigmoid">Sigmoid</option>
//       </select>
  
//       <button
//         onClick={trainModel}
//         className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
//       >
//         Train Model
//       </button>
//     </div>
//   );  
// };

// export default Controls;
