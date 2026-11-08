'use strict';
// Keep cache names separate when multiple GitHub Pages projects share one origin.
const PREFIX='dead-zone-html5:'+new URL(self.registration.scope).pathname+':';
const CACHE=PREFIX+'07091f1970ce';
const SHELL=['./index.html','./manifest.webmanifest','./icon.svg','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL))));
// An update activates after existing game tabs close, without interrupting play.
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url),scope=new URL(self.registration.scope);
  if(request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname)||url.pathname.endsWith('/sw.js'))return;
  if(request.mode==='navigate'){
    event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(request);if(response.ok){await cache.put(new URL('./index.html',self.registration.scope).href,response.clone());return response}return await cache.match('./index.html')||response}catch{return await cache.match('./index.html')||Response.error()}})());return;
  }
  if(!SHELL.some(path=>new URL(path,self.registration.scope).href===url.href))return;
  event.respondWith((async()=>{const cache=await caches.open(CACHE),cached=await cache.match(request);if(cached)return cached;const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response})());
});
