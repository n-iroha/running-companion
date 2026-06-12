// Service Worker: PWA のオフライン対応とアセットのキャッシュを担当する
const CACHE = 'rc-v1';  // キャッシュ名(バージョン)。アセット構成を変えたらこの名前を更新する
const ASSETS = ['./', './index.html', './marked.min.js', './manifest.json'];  // 事前キャッシュするファイル一覧

// インストール時: アプリの動作に必要なファイルをまとめて事前キャッシュする
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();  // 待機をスキップして新しい Service Worker を即座に有効化
});

// 有効化時: 古いバージョンのキャッシュ(CACHE 名が一致しないもの)を削除する
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
});

// リクエスト時: ネットワーク優先(network-first)戦略
// オンラインなら最新を取得してキャッシュを更新、オフラインならキャッシュから返す
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;  // 外部(GitHub API など)へのリクエストはキャッシュ対象外
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // 取得成功: レスポンスの複製をキャッシュに保存してから返す
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))  // 取得失敗(オフライン): キャッシュから返す
  );
});
