"use client"

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Configuration, FrontendConfigDocument} from "@/lib/graph/generated/graphql";
import {getClient} from "@/lib/graph/client";
import {
  PRIVATE_ABOUT_TEXT_LENGTH_KEY, PRIVATE_ANSWERS_LENGTH_KEY,
  PRIVATE_LABELS_LENGTH_KEY,
  PRIVATE_NAMES_LENGTH_KEY, PRIVATE_QUESTIONS_LENGTH_KEY,
  PRIVATE_TITLES_LENGTH_KEY, PUBLIC_CONTENT_LENGTH_KEY, PUBLIC_TITLE_LENGTH_KEY
} from "@/lib/constants/configuration-keys";

interface ConfigurationContextType {
  configuration: Configuration[];
}

const ConfigurationContext = createContext<ConfigurationContextType | null>(null);

export function ConfigurationProvider({children}: { children: ReactNode }) {
  const [configuration, setConfiguration] = useState<Configuration[]>(defaultConfig);

  useEffect(() => {
    const fetchConfiguration = async () => {
      const client = getClient()
      const data = await client.request(FrontendConfigDocument)

      if(!data.frontendConfig || data.frontendConfig.length <= 0 ) return

      const mergedConfig = defaultConfig.map(defaultValue => {
        const serverValue = (data.frontendConfig as Configuration[]).find(c => c.key === defaultValue.key)
        return serverValue ?? defaultValue
      })

      setConfiguration(mergedConfig)
    }

    void fetchConfiguration();
  }, []);


  return (
    <ConfigurationContext.Provider value={{configuration}}>
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

const defaultConfig: Configuration[] = [
  {key: PRIVATE_TITLES_LENGTH_KEY, intValue: 100},
  {key: PRIVATE_LABELS_LENGTH_KEY, intValue: 100},
  {key: PRIVATE_NAMES_LENGTH_KEY, intValue: 50},
  {key: PRIVATE_ABOUT_TEXT_LENGTH_KEY, intValue: 2000},
  {key: PRIVATE_QUESTIONS_LENGTH_KEY, intValue: 100},
  {key: PRIVATE_ANSWERS_LENGTH_KEY, intValue: 500},
  {key: PUBLIC_TITLE_LENGTH_KEY, intValue: 100},
  {key: PUBLIC_CONTENT_LENGTH_KEY, intValue: 2000},
]