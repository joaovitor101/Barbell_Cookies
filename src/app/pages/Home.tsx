import { useEffect, useState } from "react";
import { Store, Clock } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../contexts/CartContext";
import { products as fallbackProducts } from "../data/products";
import { apiUrl } from "../lib/api";
import { useStoreStatus } from "../contexts/StoreStatusContext";

export function Home() {
  const { storeOpen, loading: statusLoading } = useStoreStatus();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [offlineNotice, setOfflineNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setOfflineNotice(null);
        const res = await fetch(apiUrl("/api/products"));
        if (!res.ok) throw new Error("API indisponível");
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(fallbackProducts);
          setOfflineNotice(
            "Nenhum produto no banco — exibindo catálogo local até você cadastrar no painel."
          );
        }
      } catch {
        if (!cancelled) {
          setProducts(fallbackProducts);
          setOfflineNotice(
            "Não foi possível conectar à API — cardápio local. Suba o servidor e o MongoDB (npm run dev)."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showClosedBanner = !statusLoading && !storeOpen;
  const addDisabled = showClosedBanner;

  return (
    <div className="min-h-screen cookie-background">
      {offlineNotice && (
        <div className="bg-amber-100 text-amber-950 text-center py-3 px-4 text-sm">
          {offlineNotice}
        </div>
      )}

      {showClosedBanner && (
        <div className="border-b border-amber-200/80 bg-gradient-to-b from-amber-50 to-[#f5f0d8] px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 text-amber-800 mb-4 shadow-sm">
              <Store className="w-7 h-7" aria-hidden />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Loja fechada no momento
            </h2>
            <p className="mt-2 text-gray-600 flex items-center justify-center gap-2 text-sm sm:text-base">
              <Clock className="w-4 h-4 shrink-0 text-amber-700" aria-hidden />
              Você pode ver o cardápio abaixo, mas os pedidos estão pausados.
            </p>
            <p className="mt-3 text-sm text-amber-900/80 rounded-lg bg-white/60 px-4 py-2 inline-block border border-amber-100">
              Volte em breve — enquanto isso, dê uma olhada nos nossos cookies.
            </p>
          </div>
        </div>
      )}

      <div className="cookie-content py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cookies Barbell
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Feitos à mão com amor, entregues na sua porta. Encomende seus cookies
            favoritos hoje mesmo!
          </p>
        </div>
      </div>
      <div className="cookie-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Nossos Cookies</h2>
        {loading ? (
          <p className="text-gray-600">Carregando cardápio…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addDisabled={addDisabled}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
