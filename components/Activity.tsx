"use client";
import React, { useState, useEffect } from "react";
import { addressService } from "./newui/utils/apiroutes";
import { ChevronUp } from "lucide-react";
import { FiCopy } from "react-icons/fi";

interface Transaction {
  hash: string;
  method: string;
  from: string;
  to: string;
  value: string;
}

interface ActivityProps {
  address: string;
}

const Activity: React.FC<ActivityProps> = ({ address }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await addressService.getAddressTransactions(
          address,
          `?limit=50&page=1`
        );
        console.log("API Response:", response.items);

        const transactionData = response.items.map((item: any) => ({
          hash: item.hash || "N/A",
          method: item.method === null ? item.tx_types : item.method,
          from: item.from?.hash || "Unknown",
          to: item.to?.hash || "Unknown",
          value: (parseInt(item.value) / 10 ** 18).toFixed(6),
        }));

        setTransactions(transactionData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Error fetching transactions");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [address]);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>{error}</div>;

  const parseAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-3xl p-4 w-[869px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Activity</h2>
        <ChevronUp className="w-5 h-5" />
      </div>
      <div className="space-y-4">
        {transactions.map((tx, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex items-center space-x-2">
              <div className="bg-gray-200 rounded-full p-2">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="font-medium">{tx.method}</p>
                <p className="text-sm font-semibold text-[#06afe8] flex items-center">
                  #{parseAddress(tx.hash)}{" "}
                  <FiCopy
                    className="ml-2 text-gray-400 cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(tx.hash)}
                  />
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-orange-100 rounded-full p-1">
    
              </div>
              <div className="text-right">
                <p className="font-medium">0 ETH</p>
                <p className="text-sm text-gray-500">{tx.value} XDC</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activity;
// "use client"
// import React, { useState, useEffect } from "react";
// import { addressService } from "./newui/utils/apiroutes";

// interface Transaction {
//   hash: string;
//   from: string;
//   to: string;
//   value: string;
// }

// interface ActivityProps {
//   address: string;
// }

// const Activity: React.FC<ActivityProps> = ({ address }) => {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const response = await addressService.getAddressTransactions(
//           address,
//           `?limit=50&page=1`
//         );
//         console.log('API Response:', response.items);

//         // Process only transactions, ensuring no objects are rendered directly
//         const transactionData = response.items.map((item: any) => ({
//           hash: item.hash || "N/A", // Use "N/A" if no hash is found
//           from: item.from?.hash || "Unknown", // Handle nested `from.hash`
//           to: item.to?.hash || "Unknown", // Handle nested `to.hash`
//           value: (parseInt(item.value) / 10 ** 18).toFixed(4), // Assuming value is in wei
//         }));

//         setTransactions(transactionData);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching transactions:', err);
//         setError("Error fetching transactions");
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, [address]);

//   if (loading) return <div>Loading transactions...</div>;
//   if (error) return <div>{error}</div>;
//   const parseAddress = (address: string) => {
//     return `${address.slice(0, 6)}...${address.slice(-4)}`;
//   };
//   return (
//     <div className="bg-white rounded-3xl w-[869px]">

//       <table className="w-full">
//         <thead>
//           <tr>
//             <th className="text-left">Transaction Hash</th>
//             <th className="text-left">From</th>
//             <th className="text-left">To</th>
//             <th className="text-right">Value (XDC)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.map((tx, index) => (
//             <tr key={index}>
//               <td>{parseAddress(tx.hash)}...</td> {/* Truncate hash for display */}
//               <td>{parseAddress(tx.from)}...</td> {/* Truncate address */}
//               <td>{parseAddress(tx.to)}...</td> {/* Truncate address */}
//               <td className="text-right">{tx.value} XDC</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Activity;
