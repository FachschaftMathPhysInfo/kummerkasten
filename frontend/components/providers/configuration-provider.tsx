"use client"

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Configuration, FrontendConfigDocument} from "@/lib/graph/generated/graphql";
import {getClient} from "@/lib/graph/client";

interface ConfigurationContextType {
  configuration: Configuration[];
  triggerConfigurationRefetch: () => void;
}

const ConfigurationContext = createContext<ConfigurationContextType | null>(null);

export function ConfigurationProvider({children}: { children: ReactNode }) {
  const [configuration, setConfiguration] = useState<Configuration[]>([]);
  const [refetchKey, setRefetchKey] = useState(false);

  useEffect(() => {
    const fetchConfiguration = async () => {
      const client = getClient()
      const data = await client.request(FrontendConfigDocument)
      setConfiguration(data.frontendConfig as Configuration[])
    }

    void fetchConfiguration();
  }, [refetchKey]);

  function triggerConfigurationRefetch() {
    setRefetchKey(!refetchKey);
  }

  return (
    <ConfigurationContext.Provider value={{configuration, triggerConfigurationRefetch}}>
      {children}
    </ConfigurationContext.Provider>
  );
}

export const useConfiguration = (): ConfigurationContextType => {
  const context = useContext(ConfigurationContext);

  if (!context) {
    throw new Error("useConfiguration must be used within a ConfigurationProvider");
  }

  return context;
}