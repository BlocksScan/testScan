"use client";
import React, { useState, useEffect } from "react";
import { addressService, transactionService } from "./newui/utils/apiroutes";
import { ChevronUp } from "lucide-react";
import { FiArrowRight, FiCopy } from "react-icons/fi";
import Link from "next/link";

interface InternalTransaction {
  parentHash: string;
  from: string;
  to: string;
  value: string;
  method?: string;
}

interface InternalTxProps {
  address: string;
}

const InternalTx: React.FC<InternalTxProps> = ({ address }) => {
  const [internalTxs, setInternalTxs] = useState<InternalTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInternalTransactions = async () => {
      try {
        const response = await addressService.getAddressInternalTransactions(
          address,
          `?limit=50&page=1`
        );

        const internalTxData = response.items.map((item: any) => ({
          parentHash: item.transaction_hash,
          from: item.from?.hash || "Unknown",
          to: item.to?.hash || "Unknown",
          value: item.value
            ? (parseInt(item.value) / 10 ** 18).toFixed(6)
            : "0",
          method: item.type,
        }));

        setInternalTxs(internalTxData || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching internal transactions:", err);
        setError("Error fetching internal transactions");
        setLoading(false);
      }
    };

    fetchInternalTransactions();
  }, [address]);

  const renderSkeleton = () => (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 animate-pulse">
      <div className="flex items-center space-x-2">
        <div className="rounded-full bg-gray-200 w-8 h-8"></div>
        <div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
          <div className="w-36 h-4 bg-gray-200 rounded mt-2"></div>
        </div>
      </div>
      <div className="text-right">
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
        <div className="w-24 h-4 bg-gray-200 rounded mt-2"></div>
      </div>
    </div>
  );
  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-4 w-[869px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Internal Transaction</h2>
          <ChevronUp className="w-5 h-5" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>{renderSkeleton()}</div>
          ))}
        </div>
      </div>
    );
  }
  if (error) return <div>{error}</div>;

  const parseAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-3xl p-4 w-[869px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Internal Transactions</h2>
        <ChevronUp className="w-5 h-5" />
      </div>
      <div className="space-y-4">
        {internalTxs.map((tx, index) => (
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
                  <Link href={`/newui/tx/${tx.parentHash}`}>
                    #{parseAddress(tx.parentHash)}{" "}
                  </Link>
                  <FiCopy
                    className="ml-2 text-gray-400 cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(tx.parentHash)}
                  />
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-x-4 ">
              <div className="text-blue text-sm font-light leading font-chivo flex items-center">
                <Link href={`/newui/tx/${tx.from}`}>
                  {parseAddress(tx.from)}
                </Link>
                <FiCopy
                  className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                  onClick={() => navigator.clipboard.writeText(tx.from)}
                />
              </div>
              <FiArrowRight className="h-4 w-4" />
              <div className="text-blue text-sm font-light leading font-chivo flex items-center">
                <Link href={`/newui/tx/${tx.parentHash}`}>
                  {" "}
                  {parseAddress(tx.to)}
                </Link>

                <FiCopy
                  className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
                  onClick={() => navigator.clipboard.writeText(tx.to)}
                />
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{tx.value} XDC</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InternalTx;
{
  /* <div className="flex items-center justify-between gap-x-4 ">
<div className="text-blue text-sm font-light leading font-chivo flex items-center">
  <Link href={`/newui/tx/${tx.from}`}>
  {parseAddress(tx.from)}</Link>
  <FiCopy
    className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
    onClick={() => navigator.clipboard.writeText(tx.from)}
  />
</div>
<FiArrowRight className="h-4 w-4" />
<div className="text-blue text-sm font-light leading font-chivo flex items-center">
  {tx.to}
  <FiCopy
    className="w-3 h-3 ml-2 cursor-pointer text-[#8a98ad]"
    onClick={() => navigator.clipboard.writeText(tx.to)}
  />
</div>
</div> */
}
