import {getRequestConfig} from 'next-intl/server';
import {getLocale} from "@/lib/cookies";
import {FrontendConfigDocument, Setting} from "@/lib/graph/generated/graphql";
import {getServerClient} from "@/lib/graph/client";

// This function cannot use the configuration provider, thus the language must be fetched manually
export default getRequestConfig(async () => {
  const client = getServerClient()
  const data = await client.request(FrontendConfigDocument)
  const settings: Setting[] = data.frontendConfig as Setting[]
  const defaultLanguage = settings.find(s => s.key === "default_language")?.value ?? "de"
  const locale = await getLocale() ?? defaultLanguage

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});