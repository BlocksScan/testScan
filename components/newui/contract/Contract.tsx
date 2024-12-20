"use client";
import React, { useState, useEffect } from "react";
import { addressService } from "../utils/apiroutes";
import { FaCheckCircle } from "react-icons/fa";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ReadContracts from "./ReadContract";
import WriteContract from "./WriteContract";
import ReadProxy from "./ReadProxy";
import WriteProxy from "./WriteProxy";
import FileStructure from "./FileStructure";
import Link from "next/link";

interface AddressProps {
  address: string;
}

interface ContractData {
  isVerified: boolean;
  name: string;
  language: string;
  optimization_runs: string;
  optimization_enabled: boolean;
  compiler_version: string;
  evmVersion: string;
  license_type: string;
  source_code?: string | string[];
  abi?: any[];
  additionalResource?: {
    filePath: string;
    code: string;
  }[];
}

interface CodeTabProps {
  contract: ContractData | null;
  address: string;
}
const CodeTab: React.FC<CodeTabProps> = ({ contract, address }) => {
  if (!contract) {
    return <p>Loading contract details...</p>;
  }

  const InfoRow: React.FC<{
    label: string;
    value?: string;
    suffix?: string;
    suffixClass?: string;
    additionalInfo?: Array<{
      text: string;
      fontWeight?: string;
      className?: string;
    }>;
  }> = ({ label, value, suffix, suffixClass, additionalInfo }) => (
    <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
      <span className="text-gray-600 font-inter text-sm tracking-wider">
        {label}
      </span>
      <span className="tracking-wider text-blue font-chivo">
        {value}
        {suffix && <span className={suffixClass}> {suffix}</span>}
        {additionalInfo &&
          additionalInfo.map((info, index) => (
            <span
              key={index}
              className={info.className}
              style={{ fontWeight: info.fontWeight }}
            >
              {info.text}
            </span>
          ))}
      </span>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <p className="font-semibold text-sm flex items-center">
          <FaCheckCircle
            className={`w-4 h-4 mr-2 ${
              contract.isVerified ? "text-green-500" : "text-red-500"
            }`}
          />

          {contract.isVerified ? (
            "Contract Source Code Verified"
          ) : (
            <div>
              Contract Source Code Not Verified.{" "}
              <Link href={`/newui/contract/${address}`} className="text-red-500">Verify Now</Link>
            </div>
          )}
        </p>
      </div>

      {contract.isVerified ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <InfoRow label="Contract Name:" value={contract.name} />
              <InfoRow
                label="Compiler Version:"
                value={contract.compiler_version}
              />
              <InfoRow
                label="Optimization Runs:"
                value={contract.optimization_runs}
              />
              <InfoRow
                label="Contract Source Code (solidity):"
                value={contract.language}
              />
            </div>
            <div>
              <InfoRow
                label="Optimization Enabled:"
                value={contract.optimization_enabled ? "Yes" : "No"}
                suffix={
                  contract.optimization_enabled
                    ? `with ${contract.optimization_runs} runs`
                    : undefined
                }
                suffixClass="text-blue font-chivo tracking-wider"
              />
              <InfoRow
                label="Other Settings:"
                value={contract.evmVersion}
                additionalInfo={[
                  { text: " Evm Version, " },
                  {
                    text: contract.license_type + " ",
                    fontWeight: "font-semibold",
                  },
                  { text: "license", className: "text-blue-500" },
                ]}
              />
            </div>
          </div>
          {/* Source Code Display */}
          <div className="h-[400px] overflow-auto scrollbar-default rounded-md w-full">
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: "1rem",
                fontSize: "0.875rem",
                textWrap: "wrap",
              }}
            >
              {Array.isArray(contract.source_code)
                ? contract.source_code.join("\n")
                : contract.source_code || ""}
            </SyntaxHighlighter>
          </div>
          {/* ABI Display */}
          <div>
            <InfoRow label="Contract ABI:" />
          </div>
          <div className="h-[400px] overflow-auto scrollbar-default rounded-md w-full">
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: "1rem",
                fontSize: "0.875rem",
                textWrap: "wrap",
              }}
            >
              {JSON.stringify(contract.abi, null, 2)}
            </SyntaxHighlighter>
          </div>

          {/* File Structure Display */}
          {contract.additionalResource && (
            <FileStructure files={contract.additionalResource} />
          )}
        </>
      ) : null}
    </div>
  );
};

// Main Contract component
const Contract: React.FC<AddressProps> = ({ address }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [contract, setContract] = useState<ContractData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Code");

  // Fetch contract data on mount
  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const response = await addressService.getContract(address);
        const data: ContractData = {
          isVerified: response.is_verified,
          name: response.name,
          language: response.language,
          optimization_runs: response.optimization_runs,
          optimization_enabled: response.optimization_enabled,
          compiler_version: response.compiler_version,
          evmVersion: response.compiler_settings?.evmVersion,
          license_type: response.license_type,
          source_code: response.source_code,
          abi: response.abi,
          additionalResource:
            response.additional_sources?.map(
              (source: { file_path: string; source_code: string }) => ({
                filePath: source.file_path,
                code: source.source_code, // Ensure this matches FileNode
              })
            ) || [],
        };
        setContract(data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching contract data");
        setLoading(false);
      }
    };

    fetchContractData();
  }, [address]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white rounded-3xl">
      {/* Tab Header */}
      <div className="flex space-x-4 p-4">
        {[
          "Code",
          "Read Contract",
          "Read Proxy",
          "Write Contract",
          "Write Proxy",
        ].map((tab) => (
          <span
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-lg text-sm font-medium cursor-pointer ${
              activeTab === tab ? "bg-gray-200 text-gray-800" : ""
            }`}
          >
            {tab}
          </span>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "Code" && (
          <CodeTab contract={contract} address={address} />
        )}
        {activeTab === "Read Contract" && <ReadContracts address={address} />}
        {activeTab === "Read Proxy" && <ReadProxy address={address} />}
        {activeTab === "Write Contract" && <WriteContract address={address} />}
        {activeTab === "Write Proxy" && <WriteProxy address={address} />}
      </div>
    </div>
  );
};

export default Contract;

// import React, { useState, useEffect } from "react";
// import { addressService } from "../utils/apiroutes";
// import { FaCheckCircle } from "react-icons/fa";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import ReadContracts from "./ReadContract";
// import WriteContract from "./WriteContract";
// import ReadProxy from "./ReadProxy";
// import WriteProxy from "./WriteProxy";
// import FileStructure from "./FileStructure";

// interface AddressProps {
//   address: string;
// }

// interface ContractData {
//   isVerified: boolean;
//   name: string;
//   language: string;
//   optimization_runs: number;
//   optimization_enabled: boolean;
//   compiler_version: string;
//   evmVersion: string;
//   license_type: string;
//   source_code?: string | string[];
//   abi?: [];
//   additionalResource?: {
//     filePath: string;
//     source_code: string;
//   }[];
// }

// const CodeTab: React.FC<{ contract: ContractData | null }> = ({ contract }) => {
//   if (!contract) {
//     return <p>Loading contract details...</p>;
//   }

//   const InfoRow: React.FC<{
//     label: string;
//     value?: string;
//     suffix?: string;
//     suffixClass?: string;
//     additionalInfo?: Array<{
//       text: string;
//       fontWeight?: string;
//       className?: string;
//     }>;
//   }> = ({ label, value, suffix, suffixClass, additionalInfo }) => (
//     <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
//       <span className="text-gray-600 font-inter text-sm tracking-wider">
//         {label}
//       </span>
//       <span className="tracking-wider text-blue font-chivo ">
//         {value}
//         {suffix && <span className={suffixClass}> {suffix}</span>}
//         {additionalInfo &&
//           additionalInfo.map((info, index) => (
//             <span
//               key={index}
//               className={info.className}
//               style={{ fontWeight: info.fontWeight }}
//             >
//               {info.text}
//             </span>
//           ))}
//       </span>
//     </div>
//   );
//   console.log(contract.abi);
//   return (
//     <div className="space-y-4">
//       <div className="flex items-center">
//         <p className="font-semibold text-sm flex items-center">
//           <FaCheckCircle
//             className={`w-4 h-4 mr-2 ${
//               contract.isVerified ? "text-green-500" : "text-red-500"
//             }`}
//           />
//           Contract Source Code Verified
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <InfoRow label="Contract Name:" value={contract.name} />
//           <InfoRow
//             label="Compiler Version:"
//             value={contract.compiler_version}
//           />
//           <InfoRow
//             label="Optimization Runs:"
//             value={contract.optimization_runs.toString()}
//           />
//           <InfoRow
//             label="Contract Source Code (solidity):"
//             value={contract.language}
//           />
//         </div>
//         <div>
//           <InfoRow
//             label="Optimization Enabled:"
//             value={contract.optimization_enabled ? "Yes" : "No"}
//             suffix={
//               contract.optimization_enabled
//                 ? `with ${contract.optimization_runs} runs`
//                 : undefined
//             }
//             suffixClass="text-blue font-chivo tracking-wider"
//           />
//           <InfoRow
//             label="Other Settings:"
//             value={contract.evmVersion}
//             additionalInfo={[
//               { text: " Evm Version, " },
//               {
//                 text: contract.license_type + " ",
//                 fontWeight: "font-semibold",
//               },
//               { text: "license", className: "text-blue-500" },
//             ]}
//           />
//         </div>
//         <div className="h-[400px] overflow-auto scrollbar-default rounded-md w-[1300px]">
//           <SyntaxHighlighter
//             language="json"
//             style={vscDarkPlus}
//             customStyle={{
//               margin: 0,
//               padding: "1rem",
//               fontSize: "0.875rem",
//               textWrap: "wrap",
//             }}
//           >
//             {Array.isArray(contract.source_code)
//               ? contract.source_code.join("\n")
//               : contract.source_code || ""}
//           </SyntaxHighlighter>
//         </div>
//       </div>
//       <div>
//         <InfoRow label="Contract ABI:" />
//       </div>
//       <div className="h-[400px] overflow-auto scrollbar-default rounded-md w-[1300px]">
//         <SyntaxHighlighter
//           language="json"
//           style={vscDarkPlus}
//           customStyle={{
//             margin: 0,
//             padding: "1rem",
//             fontSize: "0.875rem",
//             textWrap: "wrap",
//           }}
//         >
//           {JSON.stringify(contract.abi, null, 2)}
//         </SyntaxHighlighter>
//       </div>
//       {contract?.additionalResource && (
//         <FileStructure files={contract.additionalResource} />
//       )}
//     </div>
//   );
// };

// const Contract: React.FC<AddressProps> = ({ address }) => {
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [contract, setContract] = useState<ContractData | null>(null);
//   const [activeTab, setActiveTab] = useState<string>("Code");

//   useEffect(() => {
//     const fetchContractData = async () => {
//       try {
//         const response = await addressService.getContract(address);
//         console.log(response);
//         const data: ContractData = {
//           isVerified: response.is_verified,
//           name: response.name,
//           language: response.language,
//           optimization_runs: response.optimization_runs,
//           optimization_enabled: response.optimization_enabled,
//           compiler_version: response.compiler_version,
//           evmVersion: response.compiler_settings?.evmVersion,
//           license_type: response.license_type,
//           source_code: response.source_code,
//           abi: response.abi,
//           additionalResource: response.additional_sources?.map((source: { file_path: string; source_code: string }) => ({
//             filePath: source.file_path, // Update to match the naming in the API response
//             code: source.source_code,    // Ensure this matches your FileNode interface
//           })),
//         };
//         setContract(data);
//         setLoading(false);
//       } catch (err) {
//         setError("Error fetching contract data");
//         setLoading(false);
//       }
//     };

//     fetchContractData();
//   }, [address]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="bg-white rounded-3xl">
//       {/* Tab Header */}
//       <div className="flex space-x-4 p-4">
//         <span
//           onClick={() => setActiveTab("Code")}
//           className={`px-3 py-1 rounded-lg text-sm font-medium cursor-pointer ${
//             activeTab === "Code" ? "bg-gray-200 text-gray-800" : ""
//           }`}
//         >
//           Code
//         </span>
//         <span
//           onClick={() => setActiveTab("Read Contract")}
//           className={`px-3 py-1 rounded-lg text-sm font-medium cursor-pointer ${
//             activeTab === "Read Contract" ? "bg-gray-200 text-gray-800" : ""
//           }`}
//         >
//           Read Contract
//         </span>
//         <span
//           onClick={() => setActiveTab("Read Proxy")}
//           className={`px-3 py-1 rounded-lg text-sm font-medium cursor-pointer ${
//             activeTab === "Read Proxy" ? "bg-gray-200 text-gray-800" : ""
//           }`}
//         >
//           Read Proxy
//         </span>
//         <span
//           onClick={() => setActiveTab("Write Contract")}
//           className={`px-3 py-1 rounded-lg text-sm font-medium cursor-pointer ${
//             activeTab === "Write Contract" ? "bg-gray-200 text-gray-800" : ""
//           }`}
//         >
//           Write Contract
//         </span>
//         <span
//           onClick={() => setActiveTab("Write Proxy")}
//           className={`px-3 py-1 rounded-lg text-sm font-medium cursor-pointer ${
//             activeTab === "Write Proxy" ? "bg-gray-200 text-gray-800" : ""
//           }`}
//         >
//           Write Proxy
//         </span>
//       </div>

//       {/* Tab Content */}
//       <div className="p-4">
//         {activeTab === "Code" && <CodeTab contract={contract} />}
//         {activeTab === "Read Contract" && <ReadContracts address={address} />}
//         {activeTab === "Read Proxy" && <ReadProxy address={address} />}
//         {activeTab === "Write Contract" && <WriteContract address={address} />}
//         {activeTab === "Write Proxy" && <WriteProxy address={address} />}
//       </div>
//     </div>
//   );
// };

// export default Contract;
