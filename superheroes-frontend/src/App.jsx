import { useEffect, useState } from "react";

const API = "/api";

function App() {
  const [section, setSection] = useState("heroes");
  const [heroes, setHeroes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({ name: "", universe: "", power: "", title: "", year: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isHeroes = section === "heroes";
  const items = isHeroes ? heroes : movies;

  async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Não foi possível concluir a operação.");
    return data;
  }

  async function loadData() {
    setLoading(true);
    try {
      const [heroData, movieData] = await Promise.all([
        request("/heroes"),
        request("/movies"),
      ]);
      setHeroes(heroData);
      setMovies(movieData);
    } catch (error) {
      setMessage(`${error.message} Confira se a API está ligada.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function clearForm() {
    setForm({ name: "", universe: "", power: "", title: "", year: "" });
    setEditing(null);
  }

  function startEdit(item) {
    setEditing(item.id);
    if (isHeroes) {
      setForm({ name: item.name, universe: item.universe, power: item.power, title: "", year: "" });
    } else {
      setForm({ name: "", universe: "", power: "", title: item.title, year: item.year });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    const path = isHeroes ? "/heroes" : "/movies";
    const payload = isHeroes
      ? { name: form.name.trim(), universe: form.universe.trim(), power: form.power.trim() }
      : { title: form.title.trim(), year: Number(form.year) };

    try {
      if (editing) {
        // PUT substitui todos os campos do registro.
        await request(`${path}/${editing}`, { method: "PUT", body: JSON.stringify(payload) });
        setMessage("Registro atualizado com sucesso.");
      } else {
        await request(path, { method: "POST", body: JSON.stringify(payload) });
        setMessage("Registro cadastrado com sucesso.");
      }
      clearForm();
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteItem(id) {
    if (!window.confirm("Tem certeza que deseja excluir este registro?")) return;
    try {
      await request(`/${section}/${id}`, { method: "DELETE" });
      setMessage("Registro excluído com sucesso.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function quickPatch(item) {
    const field = isHeroes ? "power" : "year";
    const current = isHeroes ? item.power : item.year;
    const value = window.prompt(
      isHeroes ? "Digite o novo poder:" : "Digite o novo ano:",
      String(current)
    );
    if (value === null || value.trim() === "") return;
    const patch = isHeroes ? { power: value.trim() } : { year: Number(value) };
    try {
      await request(`/${section}/${item.id}`, { method: "PATCH", body: JSON.stringify(patch) });
      setMessage("Campo atualizado parcialmente com sucesso.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  const inputClass = "w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20";

  return (
    <div className="min-h-screen bg-[#080d18] text-slate-100">
      <header className="border-b border-white/10 bg-[#0c1424]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400 text-xl font-black text-slate-950">S</div>
            <div>
              <p className="text-lg font-bold tracking-wide">SUPERHEROES <span className="text-cyan-400">API</span></p>
              <p className="text-xs text-slate-400">Painel de gerenciamento</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-9">
        <section className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Central de controle</p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Gerencie seu universo.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Cadastre, consulte, atualize e remova heróis e filmes conectados à sua API Node.js.</p>
        </section>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#111c2e] p-5">
            <p className="text-sm text-slate-400">Heróis cadastrados</p>
            <p className="mt-2 text-3xl font-bold">{heroes.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#111c2e] p-5">
            <p className="text-sm text-slate-400">Filmes cadastrados</p>
            <p className="mt-2 text-3xl font-bold">{movies.length}</p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button onClick={() => { setSection("heroes"); clearForm(); }} className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${isHeroes ? "bg-cyan-400 text-slate-950" : "border border-white/10 bg-[#111c2e] text-slate-300 hover:bg-slate-800"}`}>Heróis</button>
          <button onClick={() => { setSection("movies"); clearForm(); }} className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${!isHeroes ? "bg-cyan-400 text-slate-950" : "border border-white/10 bg-[#111c2e] text-slate-300 hover:bg-slate-800"}`}>Filmes</button>
          <button onClick={loadData} className="ml-auto rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/5">↻ Atualizar lista</button>
        </div>

        {message && <div className="mb-5 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">{message}</div>}

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <section className="h-fit rounded-2xl border border-white/10 bg-[#111c2e] p-5">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">{editing ? "Editar registro" : "Novo cadastro"}</p>
              <h2 className="mt-1 text-xl font-bold">{editing ? "Atualizar dados" : isHeroes ? "Adicionar herói" : "Adicionar filme"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isHeroes ? <>
                <label className="block text-sm text-slate-300">Nome do herói<input required className={`${inputClass} mt-2`} placeholder="Ex.: Homem-Aranha" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
                <label className="block text-sm text-slate-300">Universo<input required className={`${inputClass} mt-2`} placeholder="Ex.: Marvel" value={form.universe} onChange={e => setForm({ ...form, universe: e.target.value })} /></label>
                <label className="block text-sm text-slate-300">Poder<input required className={`${inputClass} mt-2`} placeholder="Ex.: Lançar teias" value={form.power} onChange={e => setForm({ ...form, power: e.target.value })} /></label>
              </> : <>
                <label className="block text-sm text-slate-300">Título do filme<input required className={`${inputClass} mt-2`} placeholder="Ex.: Vingadores" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
                <label className="block text-sm text-slate-300">Ano de lançamento<input required type="number" min="1888" className={`${inputClass} mt-2`} placeholder="Ex.: 2012" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} /></label>
              </>}
              <button className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-300">{editing ? "Salvar alterações" : "Cadastrar"}</button>
              {editing && <button type="button" onClick={clearForm} className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/5">Cancelar edição</button>}
            </form>
            <p className="mt-5 text-xs leading-5 text-slate-500">Os dados são enviados para a API e armazenados no banco SQLite.</p>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Banco de dados</p>
                <h2 className="text-xl font-bold">{isHeroes ? "Heróis cadastrados" : "Filmes cadastrados"}</h2>
              </div>
              <span className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-400">{items.length} registro(s)</span>
            </div>
            {loading ? <p className="rounded-2xl border border-white/10 p-8 text-center text-slate-400">Carregando dados...</p> :
              items.length === 0 ? <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center"><p className="font-semibold">Nenhum registro encontrado.</p><p className="mt-1 text-sm text-slate-500">Use o formulário para adicionar o primeiro.</p></div> :
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map(item => <article key={item.id} className="rounded-2xl border border-white/10 bg-[#111c2e] p-5 transition hover:border-cyan-400/40">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-lg text-cyan-300">{isHeroes ? "✦" : "▣"}</div>
                    <span className="text-xs text-slate-500">ID #{item.id}</span>
                  </div>
                  <h3 className="text-lg font-bold">{isHeroes ? item.name : item.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{isHeroes ? `${item.universe} · ${item.power}` : `Lançamento: ${item.year}`}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button onClick={() => startEdit(item)} className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15">Editar</button>
                    <button onClick={() => deleteItem(item.id)} className="rounded-lg border border-red-400/30 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-400/10">Excluir</button>
                  </div>
                </article>)}
              </div>}
          </section>
        </div>
      </main>
      <footer className="mt-12 border-t border-white/10 px-5 py-6 text-center text-xs text-slate-500">Projeto acadêmico · UGB · Superheroes API</footer>
    </div>
  );
}

export default App;
