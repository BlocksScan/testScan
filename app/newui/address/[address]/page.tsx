"use client"
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ArrowLeft, Copy, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Avatar from "@/public/assets/user.svg";
import Loading from "@/components/elements/Loading";
import Layout from "@/components/newui/Layout";
import Tortoise from "@/public/assets/tortoise.svg";
import Wave from "@/public/assets/sea_water.svg";
import Activity from "@/components/Activity";
import Wallet from "@/components/newui/Wallet";
import TokenTransfers from "@/components/TokenTransfers";
import InternalTx from "@/components/InternalTx";
import ContractAddress from "@/components/newui/ContractAddress";
import { useRouter } from "next/navigation";


interface PageProps {
  params: {
    address: string;
  };
}

interface UserDetails {
  name: string;
  address: string;
  avatar: string;
  netWorth: number;
  tokens: number;
  nfts: number;
  ethereumBalance: number;
}

interface Asset {
  name: string;
  symbol: string;
  balance: number;
  value: number;
  price: number;
}

const Address: React.FC<PageProps> = ({ params }) => {
  const [isContract, setIsContract] = useState<boolean | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [activeTab, setActiveTab] = useState<string>("wallet");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const rpcUrl = "https://erpc.xinfin.network/";
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

     
        const code = await provider.getCode(params.address);
        setIsContract(code !== "0x"); 

        if (code === "0x") {
        
          const balance = await provider.getBalance(params.address);
          const ethBalance = parseFloat(ethers.utils.formatEther(balance));
          const ethPrice = 2450.54;

          const userDetails: UserDetails = {
            name: `79245`,
            address: params.address,
            avatar: `/api/placeholder/32/32?text=${params.address.slice(0, 2)}`,
            netWorth: ethBalance * ethPrice,
            tokens: ethBalance * ethPrice,
            nfts: 0,
            ethereumBalance: ethBalance,
          };

          const assets: Asset[] = [
            {
              name: "Ethereum",
              symbol: "ETH",
              balance: ethBalance,
              value: ethBalance * ethPrice,
              price: ethPrice,
            },
          ];

          setUserDetails(userDetails);
          setAssets(assets);
        }
        setIsLoading(false);
      } catch (err) {
        setError("Error fetching user data");
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [params.address]);

  const parseAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "wallet":
        return <Wallet address={params.address} />;
      case "activity":
        return <Activity address={params.address} />;
      case "token":
        return <TokenTransfers address={params.address} />;
      case "internalTransactions":
        return <InternalTx address={params.address} />;
      default:
        return <Wallet address={params.address} />;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="text-blue">
          <Loading />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div>{error}</div>
      </Layout>
    );
  }

  if (isContract) {
    
    return (
      <Layout>
        <div><ContractAddress  params={params} /></div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center">
          <Link href="" onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Link>
          <span className="text-md font-semibold">User Details •</span>
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

      {/* User Details */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-black text-white rounded-3xl p-10 flex">
          <div className="flex-1 items-center">
            <Image
              src={Avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full"
              width={80}
              height={80}
            />
            <div className="mt-6">
              <h2 className="text-xl font-bold font-inter">
                Pioneer{userDetails?.name}<span className="text-xs font-chivo">:TODO</span>
              </h2>
              <p className="text-sm font-light font-inter flex items-center text-[#8a98ad]">
                {parseAddress(userDetails?.address ?? "")}
                <Copy
                  className="w-4 h-4 cursor-pointer text-[#8a98ad] ml-2"
                  onClick={() =>
                    navigator.clipboard.writeText(userDetails?.address ?? "")
                  }
                />
              </p>
              <p className="mt-8 text-sm">
                <span className="text-[#8a98ad] font-inter text-sm">
                  Net Worth
                </span>{" "}
                ${userDetails?.netWorth.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid gap-4 w-[40%]">
            <div className="bg-[#382927] pt-4 pl-4 rounded-3xl">
              <p className="text-sm">Tokens</p>
              <p className="font-bold">
                ${userDetails?.tokens.toFixed(2)}
              </p>
            </div>
            <div className="bg-[#382927] pt-4 pl-4 rounded-3xl">
              <p className="text-sm">NFTs</p>
              <p className="font-bold">${userDetails?.nfts}</p>
            </div>
          </div>
        </div>

        {userDetails && (
          <div className="bg-white rounded-3xl flex items-center h-60 w-[400px] shadow-md">
            <div className="">
              <Image
                src={Tortoise}
                alt="Tortoise"
                className=""
                width={96}
                height={96}
              />
              <Image
                src={Wave}
                alt="Wave"
                className="w-[440px] h-[200px]"
                width={96}
                height={96}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {[
              "wallet",
              "activity",
              "token",
              "internalTransactions",
              "insights",
            ].map((tab) => (
              <a
                key={tab}
                href="#"
                className={`border-b-2 py-2 px-4 text-sm font-medium ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } ${tab === "insights" ? "text-gray-400" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() +
                  tab.slice(1).replace(/([A-Z])/g, " $1")}
                {tab === "insights" && " (Coming Soon)"}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">{renderTabContent()}</div>
    </Layout>
  );
};

export default Address;


