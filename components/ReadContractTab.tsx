import React from "react";
import InputField from "./InputField";
import { BigNumber } from "ethers";

const ReadContractTab = ({
  readFunctions,
  inputs,
  handleInputChange,
  handleReadFunctions,
  results,
}: {
  readFunctions: any[];
  inputs: { [key: string]: any[] };
  handleInputChange: (fnName: string, idx: number, value: string) => void;
  handleReadFunctions: (fn: any) => void;
  results: { [key: string]: any };
}) => {
  const formatResult = (result: any) => {
    if (BigNumber.isBigNumber(result)) {
      return result.toString();
    }
    if (typeof result === "object" && result.type === "BigNumber") {
      return BigNumber.from(result).toString();
    }
    return JSON.stringify(result);
  };

  return (
    <div className="results">
      {readFunctions.map((fn, index) => (
        <div key={index}>
          <div className="read-function">
            <h2>{fn.name}</h2>
            {fn.inputs && fn.inputs.length > 0 && (
              <div className="inputs mb-4">
                {fn.inputs.map((input: any, idx: number) => (
                  <InputField
                    key={idx}
                    input={input}
                    idx={idx}
                    fnName={fn.name}
                    handleInputChange={handleInputChange}
                  />
                ))}
              </div>
            )}
            <button
              onClick={() => handleReadFunctions(fn)}
              className="bg-green-400 px-4 py-2 rounded-md"
            >
              Call {fn.name}
            </button>
          </div>
          {results[fn.name] && (
            <p>Result: {formatResult(results[fn.name])}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReadContractTab;
