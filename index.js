import * as cheerio from 'cheerio';

async function fetchSslProxies() {
  const page = await fetch('https://www.sslproxies.org')
    .then((res) => res.text())
    .catch((err) => {
      console.log(`Failed to fetch: ${err.message}`);
      return null;
    });

  return page;
}

async function formatProxyList(page) {
  if (page === null) {
    console.log('Nothing to format :/');
    return;
  }

  const $ = cheerio.load(page);
  const proxies = $('.fpl-list > table > tbody > tr')
    .map((i, elm) => {
      const tds = $(elm).find('td');
      const ip = tds.eq(0).text();
      const port = tds.eq(1).text();
      const countryCode = tds.eq(2).text();
      const anonymity = tds.eq(4).text();
      const google = tds.eq(5).text();
      const https = tds.eq(6).text();

      return {
        ip,
        port,
        anonymity,
        google,
        https,
        country_code: countryCode,
      };
    })
    .get();

  return JSON.stringify(proxies, null, 2);
}

async function writeFile(path, text) {
  await Bun.write(path, text);
}
async function run() {
  const page = await fetchSslProxies();
  const proxies = await formatProxyList(page);

  writeFile('output/output.json', proxies);
  // console.log(proxies);
}

run();
