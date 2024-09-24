import React from "react";
import PropTypes from "prop-types";
import { ArrowRight } from "lucide-react";

interface StatCardProps {
    title: string;
    description: string;
  }
  

  interface FeaturedCardProps {
    title: string;
    buttonText: string;
  }
const ExploreComponent = () => {
  return (
    <div className=" mx-auto px-6 bg-white rounded-lg mb-20">
      <div className="bg-gray-50 p-4 rounded-3xl">
        <h1 className="text-5xl font-bold  text-blue-600 mb-4">MANTA</h1>
        <p className="text-md font-normal text-gray-700  mb-8">
          The first EVM-native modular execution layer for wide ZK applications
          adoption, with Manta universal circuit and zk interface.
        </p>

        <div className="flex gap-8 mb-8">
          <StatCard
            title="80% Cheaper"
            description="Lower transaction costs through Celestia and Caldera's OP Stack Rollup solution."
          />
          <StatCard
            title="1.5M Users"
            description="Significant user base in the ZK space, with over 300,000 zkSBTs minted on NPO sites."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        <FeaturedCard
          title="New Paradigm is live! Bridge ETH or USDC to earn PENTA yield and Manta Token Rewards"
          buttonText="Join Now"
        />
        <FeaturedCard
          title="SocialFi platform to build and grow web3 community"
          buttonText="Galxe"
        />
      </div>
    </div>
  );
};

const StatCard:React.FC<StatCardProps > = ({ title, description }) => (
  <div className=" rounded-lg w-96">
    <h2 className="text-2xl font-inter font-semibold text-[#06afe8]">
      {title}
    </h2>
    <p className="text-gray-600">{description}</p>
  </div>
);

const FeaturedCard:React.FC<FeaturedCardProps> = ({ title, buttonText }) => (
  <div className="bg-gray-800 p-6 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300">
    <h3 className="text-[#06afe8] mb-2">FEATURED</h3>
    <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
    <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 flex items-center">
      {buttonText} <ArrowRight className="ml-2" size={20} />
    </button>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

FeaturedCard.propTypes = {
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default ExploreComponent;