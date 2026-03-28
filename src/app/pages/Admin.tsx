import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { Switch } from "../components/ui/switch";
import { useStoreStatus } from "../contexts/StoreStatusContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import type { Product } from "../contexts/CartContext";
import {
  adminHeaders,
  apiUrl,
  getAdminToken,
  setAdminToken,
} from "../lib/api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  sortOrder: "0",
};

export function Admin() {
  const { refetch: refetchStoreStatus } = useStoreStatus();
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [storeOpen, setStoreOpen] = useState(true);
  const [storeLoading, setStoreLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const tryLoadProducts = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return false;
    const res = await fetch(apiUrl("/api/auth/verify"), {
      headers: adminHeaders(),
    });
    return res.ok;
  }, []);

  const verifySession = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      setLoggedIn(false);
      setChecking(false);
      return;
    }
    const ok = await tryLoadProducts();
    if (ok) setLoggedIn(true);
    else {
      setAdminToken(null);
      setLoggedIn(false);
    }
    setChecking(false);
  }, [tryLoadProducts]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/products"));
      if (!res.ok) throw new Error();
      setProducts(await res.json());
    } catch {
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    loadProducts();
  }, [loggedIn, loadProducts]);

  useEffect(() => {
    if (!loggedIn) return;
    let cancelled = false;
    (async () => {
      setStoreLoading(true);
      try {
        const res = await fetch(apiUrl("/api/store/status"));
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (!cancelled) setStoreOpen(Boolean(data.storeOpen));
      } finally {
        if (!cancelled) setStoreLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loggedIn]);

  const handleStoreToggle = async (checked: boolean) => {
    try {
      const res = await fetch(apiUrl("/api/store/settings"), {
        method: "PATCH",
        headers: adminHeaders(),
        body: JSON.stringify({ storeOpen: checked }),
      });
      const err = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(err.error || "Erro ao salvar");
        return;
      }
      setStoreOpen(checked);
      refetchStoreStatus();
      toast.success(
        checked ? "Loja aberta para pedidos" : "Loja fechada — só vitrine"
      );
    } catch {
      toast.error("Erro de rede");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Senha incorreta");
        return;
      }
      setAdminToken(password);
      setPassword("");
      setLoggedIn(true);
      toast.success("Login ok");
    } catch {
      toast.error("Falha na rede — API está rodando?");
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    setLoggedIn(false);
    setProducts([]);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      image: p.image,
      sortOrder: String(p.sortOrder ?? 0),
    });
    setDialogOpen(true);
  };

  const saveProduct = async () => {
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      image: form.image.trim(),
      sortOrder: Number(form.sortOrder) || 0,
    };
    if (!payload.name || !payload.image || Number.isNaN(payload.price)) {
      toast.error("Preencha nome, preço e imagem");
      return;
    }
    try {
      const url = editingId
        ? apiUrl(`/api/products/${editingId}`)
        : apiUrl("/api/products");
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: adminHeaders(),
        body: JSON.stringify(payload),
      });
      const err = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(err.error || "Erro ao salvar");
        return;
      }
      toast.success(editingId ? "Atualizado" : "Criado");
      setDialogOpen(false);
      loadProducts();
    } catch {
      toast.error("Erro de rede");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(apiUrl(`/api/products/${deleteId}`), {
        method: "DELETE",
        headers: adminHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Erro ao excluir");
        return;
      }
      toast.success("Removido");
      setDeleteId(null);
      loadProducts();
    } catch {
      toast.error("Erro de rede");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center cookie-background">
        <p className="text-gray-600">Carregando…</p>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center cookie-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Painel — Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="pw">Senha</Label>
                <Input
                  id="pw"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                Entrar
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/">Voltar à loja</Link>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen cookie-background py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cardápio (CMS)</h1>
            <p className="text-sm text-gray-600">POST · PUT · DELETE</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/">Loja</Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <Card className="border-amber-200/80 bg-amber-50/40">
          <CardHeader>
            <CardTitle>Status da loja</CardTitle>
            <CardDescription>
              Com a loja fechada, o cardápio continua visível, mas ninguém
              adiciona ao carrinho.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {storeLoading ? (
              <p className="text-sm text-gray-500">Carregando…</p>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <Label htmlFor="store-open" className="text-base">
                    Aceitar pedidos
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Desligado = loja fechada
                  </p>
                </div>
                <Switch
                  id="store-open"
                  checked={storeOpen}
                  onCheckedChange={handleStoreToggle}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={openCreate}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo cookie
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>
              <code className="text-xs">images/arquivo.webp</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-600">Carregando…</p>
            ) : products.length === 0 ? (
              <p className="text-gray-600">Nenhum produto.</p>
            ) : (
              <ul className="divide-y rounded-md border">
                {products.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center gap-3 p-3 text-sm"
                  >
                    <img
                      src={p.image}
                      alt=""
                      className="w-14 h-14 rounded object-cover bg-muted"
                    />
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-gray-500 text-xs line-clamp-1">
                        {p.description}
                      </p>
                    </div>
                    <span className="tabular-nums">
                      R${" "}
                      {p.price.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => openEdit(p)}
                        aria-label="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => setDeleteId(p.id)}
                        aria-label="Excluir"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar cookie" : "Novo cookie"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="desc">Descrição</Label>
              <Textarea
                id="desc"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="image">URL da imagem</Label>
              <Input
                id="image"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="sort">Ordem na lista</Label>
              <Input
                id="sort"
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-amber-600 hover:bg-amber-700"
              onClick={saveProduct}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir este cookie?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
