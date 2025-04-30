import { translateFromUrl, init } from "./js/translate.mjs"

const _init = init().then(() => {
  console.log("Translate Service 初始化完成。");
})

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  if (event.data === 'INIT') {
    console.log('頁面載入時主動通知 SW 初始化');
    
    event.waitUntil(
      (async () => {
        await self.clients.claim(); // 讓 SW 立即接管頁面
        await _init;
        const clients = await self.clients.matchAll({ includeUncontrolled: true });
        for (const client of clients) {
          client.postMessage({ type: 'SW_INITED' });
        }
      })()
    );
  }
});
  
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('type=lrc') && !event.request.url.includes('no-capture=1')) {
    event.respondWith((async () => {
      await _init;
      const responseBody = await translateFromUrl(`${event.request.url}&no-capture=1`);
      return new Response(responseBody);
    })());
  }
});