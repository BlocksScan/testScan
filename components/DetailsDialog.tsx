// components/DetailsDialog.tsx

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRpcLatency, useRpcStatus } from "@/utils/useRpcStatus";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea component
import { Separator } from "./ui/separator";

interface Chain {
  name: string;
  chain: string;
  chainId: number;
  rpc: string[];
  faucets: string[];
  infoURL: string;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls?: string[];
}

interface DetailsDialogProps {
  chain: Chain;
}

const DetailsDialog: React.FC<DetailsDialogProps> = ({ chain }) => {
  const rpcStatuses = useRpcStatus(chain.rpc);
  const rpcLatencies = useRpcLatency(chain.rpc);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Details</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-full">
        <DropdownMenuLabel className="text-center">RPC URLs</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-60 ">
          <ul className="list-none space-y-2">
            {chain.rpc.map((rpcUrl) => (
              <>
                <li
                  key={rpcUrl}
                  className={`px-2 ${
                    rpcStatuses[rpcUrl] ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {rpcUrl} - {rpcStatuses[rpcUrl] ? "Working" : "Not Working"} -{" "}
                  {rpcLatencies[rpcUrl] !== undefined
                    ? `${rpcLatencies[rpcUrl]} ms`
                    : "Latency not available"}
                </li>
                <DropdownMenuSeparator />
              </>
            ))}
          </ul>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DetailsDialog;