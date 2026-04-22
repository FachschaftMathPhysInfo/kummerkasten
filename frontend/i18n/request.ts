import {getRequestConfig} from 'next-intl/server';
import {getLocale} from "@/lib/cookies";
import {Configuration, FrontendConfigDocument, StringConfiguration} from "@/lib/graph/generated/graphql";
import {getServerClient} from "@/lib/graph/client";

// This function cannot use the configuration provider, thus the language must be fetched manually
export default getRequestConfig(async () => {
  let locale = await getLocale()

  if (!locale) {
    try {
      const client = getServerClient()
      const data = await client.request(FrontendConfigDocument)
      const configuration: Configuration[] = data.frontendConfig as Configuration[]
      const defaultLanguage: StringConfiguration = configuration.find(s => s.key === "default_language") as StringConfiguration
      locale = defaultLanguage.stringValue
    } catch {
      console.warn('could not fetch i8n config from backend, falling back on default locale')
    }
  }

  if (!locale || locale.length == 0) locale = "de"

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});