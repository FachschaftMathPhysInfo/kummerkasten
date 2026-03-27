import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async () => {
  // FIXME: make dynamic
  const locale = 'de';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});