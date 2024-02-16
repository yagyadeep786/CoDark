import { spawn } from "child_process";

const runPythonProcess = async () => {
    console.log("Python is ready to go...");

    spawn("python",["tri-model.py"]);

};
export default { runPythonProcess };
