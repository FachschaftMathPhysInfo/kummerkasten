import {getRequestConfig} from 'next-intl/server';
import {getLocale} from "@/lib/cookies";

export default getRequestConfig(async () => {
  const locale = await getLocale() ?? "de"

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});