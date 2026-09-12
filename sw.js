const CACHE_NAME = "mybudget-static-v9";
const ASSETS = [
    "./",
    "./index.html",
    "./css/theme.css",
    "./css/layout.css",
    "./css/sidebar.css",
    "./css/components.css",
    "./css/toast.css",
    "./js/app.js",
    "./js/store/storage.js",
    "./js/store/default_data.js",
    "./js/domain/expense.js",
    "./js/domain/budget.js",
    "./js/domain/analytics.js",
    "./js/domain/csv_export.js",
    "./js/actions/data_transfer.js",
    "./js/controllers/shortcuts.js",
    "./js/components/metrics.js",
    "./js/components/charts.js",
    "./js/components/modal.js",
    "./js/components/sidebar.js",
    "./js/components/expense_view.js",
    "./js/components/budget_view.js",
    "./js/components/simple_view.js",
    "./js/components/toast.js",
    "./js/components/expense_modal_form.js",
    "./js/components/budget_modal_form.js",
    "./js/components/shortcuts_modal.js"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(() => {})
    );
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)
        ))
    );
    self.clients.claim();
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request)).catch(() => fetch(e.request))
    );
});
