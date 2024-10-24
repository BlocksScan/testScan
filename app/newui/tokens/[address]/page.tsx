"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Copy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Loading from "@/components/elements/Loading";
import Layout from "@/components/newui/Layout";
import Transfers from "@/components/newui/Transfers";
import TokenHolders from "@/components/newui/TokenHolders";
import ContractDetails from "@/components/newui/ContractDetails";
import { tokenService } from "@/components/newui/utils/apiroutes";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
interface PageProps {
  params: {
    address: string;
  };
}

const Token: React.FC<PageProps> = ({ params }) => {
  const [activeTab, setActiveTab] = useState<string>("transfers");
  const [tokenData, setTokenData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [topHolders, setTopHolders] = useState<any[]>([]); // State for top holders

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await tokenService.getToken(params.address);
        setTokenData(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching token data:", error);
        setLoading(false);
      }
    };

    const fetchTopHolders = async () => {
      try {
        const response = await tokenService.getTokenHolders(
          params.address,
          "?limit=3&page=1"
        ); // Fetch top 3 holders
        setTopHolders(response.items); // Assuming response.items contains the holders
      } catch (error) {
        console.error("Error fetching top holders:", error);
      }
    };

    fetchTokenData();
    fetchTopHolders();
  }, [params.address]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "transfers":
        return <Transfers address={params.address} />;
      case "holders":
        return <TokenHolders address={params.address} />;
      case "contract":
        return <ContractDetails address={params.address} />;
      default:
        return <Transfers address={params.address} />;
    }
  };

  const parseAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="mb-4">
            <div className="flex items-center">
              <Link href="/newui">
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Link>
              <span className="text-md font-semibold">Token Details</span>
            </div>
            <div className="flex items-center ml-[22px] mt-1">
              <Link href="/newui" className="text-blue text-sm">
                Home •
              </Link>
              <p className="text-sm font-light ml-2">
                {parseAddress(params.address)}
              </p>
              <Copy
                className="w-4 h-4 ml-2 cursor-pointer text-[#8a98ad]"
                onClick={() => navigator.clipboard.writeText(params.address)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-black text-white rounded-3xl p-10 flex">
              <div className="flex-1 items-center">
                <Image
                  src={tokenData?.icon_url || "/assets/user.svg"}
                  alt={tokenData?.name || "Token Image"}
                  className="w-20 h-20 rounded-full"
                  width={80}
                  height={80}
                />
                <div className="mt-6">
                  <h2 className="text-xl font-bold font-inter">
                    {tokenData?.name || "Token Name"}
                  </h2>
                  <p className="text-sm font-light font-inter text-[#8a98ad]">
                    Symbol: {tokenData?.symbol || "N/A"}
                  </p>
                </div>
              </div>

              {/* Token Data Cards */}
              <div className="grid grid-cols-2 gap-4 w-[80%]">
                <div className="bg-[#382927] pt-4 pl-4 rounded-3xl">
                  <p className="text-sm">Circulating Market Cap (USD)</p>
                  <p className="font-bold">
                    {tokenData.circulating_market_cap_usd || "N/A"}
                  </p>
                </div>
                <div className="bg-[#382927] pt-4 pl-4 rounded-3xl">
                  <p className="text-sm">Max Supply</p>
                  <p className="font-bold">{tokenData.max_supply || "N/A"}</p>
                </div>
                <div className="bg-[#382927] pt-4 pl-4 rounded-3xl">
                  <p className="text-sm">Exchange Rate (USD)</p>
                  <p className="font-bold">
                    {tokenData.exchange_rate || "N/A"}
                  </p>
                </div>
                <div className="bg-[#382927] pt-4 pl-4 rounded-3xl">
                  <p className="text-sm">24h Volume</p>
                  <p className="font-bold">{tokenData.volume_24h || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Top Holders */}
            <div className="bg-white rounded-3xl p-4 shadow-md">
              <h2 className="text-lg font-semibold mb-2">Top Holders</h2>
              {topHolders.length > 0 ? (
                <ul className="space-y-2">
                    {topHolders.map((holder, index)=> {
                      const percentage = parseFloat(holder.value) / parseFloat(tokenData?.total_supply);
                      const result = percentage * 100;
                 
                      return (
                        <li key={index} className="flex justify-between">
                          <span className="text-sm">
                            {holder.address?.name ||
                              parseAddress(holder.address.hash)}
                          </span>
                          <span className="text-sm flex items-center">
                            {(
                              (parseFloat(holder.value) /
                                parseFloat(tokenData?.total_supply)) *
                              100
                            ).toFixed(2)}
                            %
                            <div className="w-6 h-6 ml-2">
                              <CircularProgressbar
                                value={result}
                                styles={buildStyles({
                                  textSize: "32px",
                                  pathColor: `#4caf50`, // Progress bar color
                                  textColor: "#fff", // Text color
                                  trailColor: "#d6d6d6", // Background of the progress bar
                                })}
                              />
                            </div>
                          </span>
                        </li>
                      )
                    })}
                </ul>
              ) : (
                <p>No holders found.</p>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                {["transfers", "holders", "contract"].map((tab) => (
                  <a
                    key={tab}
                    href="#"
                    className={`border-b-2 py-2 px-4 text-sm font-medium ${
                      activeTab === tab
                        ? "border-blue text-blue"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() +
                      tab.slice(1).replace(/([A-Z])/g, " $1")}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-4">{renderTabContent()}</div>
        </>
      )}
    </Layout>
  );
};

export default Token;
