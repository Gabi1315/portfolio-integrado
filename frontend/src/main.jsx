import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import EscolhaFormacao from './pages/EscolhaFormacao.jsx';
import Senai from './pages/Senai.jsx';
import Sesi from './pages/Sesi.jsx';
import Inicio from './pages/Inicio.jsx';
import QuemSouEu from './pages/QuemSouEu.jsx';
import './styles.css';

const API = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3333' : '')).replace(/\/$/, '');
const projetoVazio = { formacaoId: 1, secaoId: 5, titulo: '', descricao: '', tecnologias: '', categoria: 'Projeto Integrado', imagem: '', github: '', link: '', publicado: true };

function App() {
  const [apiOnline, setApiOnline] = useState(false);
  useEffect(() => {
    let ativo = true;
    if (!API) { setApiOnline(false); return () => { ativo = false; }; }
    fetch(`${API}/api/status`).then((r) => { if (ativo) setApiOnline(r.ok); }).catch(() => { if (ativo) setApiOnline(false); });
    return () => { ativo = false; };
  }, []);

  return (
    <div className="app">
      <header>
        <Link to="/" className="logo"><span>PORTFÓLIO</span><strong>INTEGRADO</strong></Link>
        <div className="palette"><i></i><i></i><i></i><i></i></div>
      </header>
      <nav>
        <Link to="/">INÍCIO</Link>
        <Link to="/quem-sou-eu">QUEM SOU EU</Link>
        <Link to="/formacoes">SENAI | SESI</Link>
      </nav>
      <div className="apiStatus"><span className={apiOnline ? 'online' : 'offline'}></span>{apiOnline ? 'API conectada' : 'API desconectada'}</div>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/quem-sou-eu" element={<QuemSouEu />} />
        <Route path="/formacoes" element={<EscolhaFormacao />} />
        <Route path="/senai" element={<Senai />} />
        <Route path="/sesi" element={<Sesi />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/projetos" element={<ProjetosPublicos />} />
        <Route path="/aprendizagens" element={<Aprendizagens />} />
        <Route path="/registros" element={<Registros />} />
        <Route path="/reflexao" element={<Reflexao />} />
        <Route path="*" element={<Page title="PÁGINA NÃO ENCONTRADA"><p>O endereço acessado não existe.</p><Link className="primary" to="/">Voltar ao início</Link></Page>} />
      </Routes>
      <footer><span>PORTFÓLIO INTEGRADO • REACT + NODE.JS + MYSQL</span><Link to="/admin" className="adminLink">ÁREA ADMINISTRATIVA</Link></footer>
    </div>
  );
}

function Page({ title, children }) { return <section className="page"><h1 className="sectionTitle">{title}</h1>{children}</section>; }

function ProjetosPublicos() {
  const [lista, setLista] = useState([]);
  const [erro, setErro] = useState('');
  useEffect(() => {
    fetch(`${API}/api/projetos/1`).then(async (r) => { if (!r.ok) throw new Error('Não foi possível carregar os projetos.'); return r.json(); }).then(setLista).catch((e) => setErro(e.message));
  }, []);
  return <Page title="PROJETOS"><p className="intro">Trabalhos desenvolvidos no curso de Informática.</p>{erro && <p className="errorMessage">{erro}</p>}{lista.length === 0 && !erro && <div className="empty">Nenhum projeto publicado ainda.</div>}<div className="projectGrid">{lista.map((p) => <article className="project" key={p.id}><div className="projectImg">{p.imagem ? <img src={p.imagem} alt={p.titulo} /> : <>PROJETO<br />{String(p.id).padStart(2, '0')}</>}</div><div><small>{p.categoria || 'PROJETO'}</small><h2>{p.titulo}</h2><p>{p.descricao}</p>{p.tecnologias && <p><b>Tecnologias:</b> {p.tecnologias}</p>}<div className="links">{p.github && <a href={p.github} target="_blank" rel="noreferrer">GitHub ↗</a>}{p.link && <a href={p.link} target="_blank" rel="noreferrer">Projeto ↗</a>}</div></div></article>)}</div></Page>;
}

function Aprendizagens() { return <Page title="APRENDIZAGENS"><div className="paper"><h2>O que aprendi</h2><p>Este espaço reúne os principais conhecimentos construídos ao longo do ano e os desafios enfrentados.</p><h3>Competências desenvolvidas</h3><ul><li>Programação e desenvolvimento web</li><li>Trabalho em equipe</li><li>Resolução de problemas</li><li>Comunicação</li><li>Criatividade</li></ul></div></Page>; }
function Registros() { return <Page title="REGISTROS"><div className="gallery"><div>ADICIONE SEUS REGISTROS</div></div><p className="hint">Inclua fotografias e vídeos das atividades e dos projetos realizados.</p></Page>; }
function Reflexao() { return <Page title="REFLEXÃO"><div className="paper"><h2>Minha trajetória</h2><p>Registre como foi sua jornada, quais experiências marcaram sua aprendizagem e quais desafios conseguiu superar.</p><h3>Autoavaliação</h3><p>Descreva o que desenvolveu e o que ainda deseja melhorar.</p></div></Page>; }

function Admin() {
  const navigate = useNavigate();
  const [projeto, setProjeto] = useState(projetoVazio);
  const [editandoId, setEditandoId] = useState(null);
  const [secoesProjeto, setSecoesProjeto] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [conteudo, setConteudo] = useState({ formacaoId: 2, secaoId: '', bimestre: 1, titulo: '', texto: '', ordem: 1, publicado: true });
  const [secoesConteudo, setSecoesConteudo] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [mensagemConteudo, setMensagemConteudo] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [token, setToken] = useState(() => sessionStorage.getItem('adminToken') || '');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erroLogin, setErroLogin] = useState('');

  async function requisicao(url, opcoes = {}) {
    const headers = { ...(opcoes.headers || {}) };
    if (token && opcoes.method && opcoes.method !== 'GET') headers.Authorization = `Bearer ${token}`;
    const resposta = await fetch(`${API}${url}`, { ...opcoes, headers });
    const texto = await resposta.text();
    let dados = null;
    try { dados = texto ? JSON.parse(texto) : null; } catch { dados = null; }
    if (!resposta.ok) throw new Error(dados?.erro || `Erro na solicitação (${resposta.status}).`);
    return dados;
  }

  async function carregarBase() {
    setCarregando(true);
    try {
      await requisicao('/api/formacoes');
      const [listaProjetos, listaSecoesSenai, listaSecoesSesi] = await Promise.all([
        requisicao('/api/projetos/1'),
        requisicao('/api/formacoes/secoes/1'),
        requisicao('/api/formacoes/secoes/2')
      ]);
      setProjetos(Array.isArray(listaProjetos) ? listaProjetos : []);
      setSecoesProjeto(Array.isArray(listaSecoesSenai) ? listaSecoesSenai : []);
      setSecoesConteudo(Array.isArray(listaSecoesSesi) ? listaSecoesSesi : []);
      if (listaSecoesSenai?.length) setProjeto((atual) => ({ ...atual, secaoId: listaSecoesSenai[0].id }));
      if (listaSecoesSesi?.length) setConteudo((atual) => ({ ...atual, secaoId: listaSecoesSesi[0].id }));
    } catch (e) { setMensagem(e.message || 'Não foi possível carregar os dados.'); }
    finally { setCarregando(false); }
  }

  useEffect(() => { carregarBase(); }, []);

  async function entrar(e) {
    e.preventDefault();
    setErroLogin('');
    try {
      const resposta = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha })
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível entrar.');
      sessionStorage.setItem('adminToken', dados.token);
      setToken(dados.token);
      setSenha('');
    } catch (erro) {
      setErroLogin(erro.message);
    }
  }

  function sair() {
    sessionStorage.removeItem('adminToken');
    setToken('');
    setUsuario('');
  }

  async function salvarProjeto(e) {
    e.preventDefault(); setMensagem('');
    try {
      await requisicao(editandoId ? `/api/projetos/${editandoId}` : '/api/projetos', { method: editandoId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...projeto, formacaoId: Number(projeto.formacaoId), secaoId: Number(projeto.secaoId) }) });
      setMensagem(editandoId ? 'Projeto atualizado com sucesso.' : 'Projeto cadastrado e publicado com sucesso.');
      setEditandoId(null);
      setProjeto({ ...projetoVazio, secaoId: secoesProjeto[0]?.id || 5 });
      const atualizados = await requisicao('/api/projetos/1');
      setProjetos(Array.isArray(atualizados) ? atualizados : []);
    } catch (e2) { setMensagem(e2.message || 'Não foi possível cadastrar o projeto.'); }
  }

  async function excluirProjeto(id) {
    if (!window.confirm('Tem certeza de que deseja excluir este projeto?')) return;
    try {
      await requisicao(`/api/projetos/${id}`, { method: 'DELETE' });
      setProjetos((lista) => lista.filter((p) => p.id !== id));
      setMensagem('Projeto excluído.');
    } catch (e) { setMensagem(e.message || 'Não foi possível excluir o projeto.'); }
  }

  async function salvarConteudo(e) {
    e.preventDefault(); setMensagemConteudo('');
    try {
      await requisicao('/api/conteudos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...conteudo, formacaoId: Number(conteudo.formacaoId), secaoId: Number(conteudo.secaoId), bimestre: Number(conteudo.bimestre), ordem: Number(conteudo.ordem) }) });
      setMensagemConteudo('Conteúdo cadastrado e publicado com sucesso.');
      setConteudo((atual) => ({ ...atual, titulo: '', texto: '', ordem: Number(atual.ordem) + 1 }));
    } catch (e2) { setMensagemConteudo(e2.message || 'Não foi possível cadastrar o conteúdo.'); }
  }

  if (!token) return <section className="page admin"><h1 className="sectionTitle">ACESSO ADMINISTRATIVO</h1><p className="intro">Entre com as credenciais administrativas para cadastrar e editar o portfólio.</p><form className="adminLogin" onSubmit={entrar}><label>Usuário<input autoComplete="username" required value={usuario} onChange={(e) => setUsuario(e.target.value)} /></label><label>Senha<input type="password" autoComplete="current-password" required value={senha} onChange={(e) => setSenha(e.target.value)} /></label><button className="publishButton" type="submit">ENTRAR</button>{erroLogin && <p className="errorMessage" role="alert">{erroLogin}</p>}</form></section>;

  return <section className="page admin"><div className="adminHeading"><div><h1 className="sectionTitle">ÁREA ADMINISTRATIVA</h1><p className="intro">Use esta área para cadastrar e organizar o material que será exibido no portfólio público.</p></div><button className="cancelButton" type="button" onClick={sair}>SAIR</button></div>
    {carregando && <p className="hint">Carregando dados...</p>}
    <div className="adminBox"><h2>{editandoId ? 'EDITAR PROJETO • SENAI' : 'NOVO PROJETO • SENAI'}</h2><p className="adminHint">Preencha os dados do projeto. Para imagens e arquivos, informe links públicos; o upload direto ainda não está implementado.</p>
      <form onSubmit={salvarProjeto}>
        <label>Título<input required maxLength="255" value={projeto.titulo} onChange={(e) => setProjeto({ ...projeto, titulo: e.target.value })} placeholder="Nome do projeto" /></label>
        <label>Descrição<textarea required value={projeto.descricao} onChange={(e) => setProjeto({ ...projeto, descricao: e.target.value })} placeholder="Explique o objetivo e o desenvolvimento do projeto" /></label>
        <label>Tecnologias<input value={projeto.tecnologias} onChange={(e) => setProjeto({ ...projeto, tecnologias: e.target.value })} placeholder="Ex.: React, Node.js e MySQL" /></label>
        <label>Categoria<input value={projeto.categoria} onChange={(e) => setProjeto({ ...projeto, categoria: e.target.value })} placeholder="Ex.: Projeto Integrado" /></label>
        <label>Imagem (URL)<input type="url" value={projeto.imagem} onChange={(e) => setProjeto({ ...projeto, imagem: e.target.value })} placeholder="https://..." /></label>
        <label>GitHub (URL)<input type="url" value={projeto.github} onChange={(e) => setProjeto({ ...projeto, github: e.target.value })} placeholder="https://github.com/..." /></label>
        <label>Link do projeto (URL)<input type="url" value={projeto.link} onChange={(e) => setProjeto({ ...projeto, link: e.target.value })} placeholder="https://..." /></label>
        <button className="publishButton" type="submit" disabled={!projeto.secaoId}>{editandoId ? 'SALVAR ALTERAÇÕES' : 'PUBLICAR PROJETO'}</button>
        {editandoId && <button className="cancelButton" type="button" onClick={() => { setEditandoId(null); setProjeto({ ...projetoVazio, secaoId: secoesProjeto[0]?.id || 5 }); }}>CANCELAR EDIÇÃO</button>}
      </form>
      {mensagem && <p className="adminMessage" role="status">{mensagem}</p>}
    </div>

    <div className="adminBox"><h2>PROJETOS CADASTRADOS</h2>{projetos.length === 0 ? <p className="hint">Nenhum projeto publicado no SENAI.</p> : projetos.map((p) => <div className="adminProjectRow" key={p.id}><div><b>{p.titulo}</b><small>{p.categoria || 'Projeto'}</small></div><button type="button" className="dangerButton" onClick={() => excluirProjeto(p.id)}>EXCLUIR</button></div>)}</div>

    <div className="adminBox"><h2>ADICIONAR CONTEÚDO • SESI</h2><form onSubmit={salvarConteudo}>
      <label>Formação<select value={conteudo.formacaoId} onChange={(e) => { const id = Number(e.target.value); setConteudo({ ...conteudo, formacaoId: id, secaoId: '' }); }}><option value={2}>SESI • Ensino Médio</option></select></label>
      <label>Disciplina<select required value={conteudo.secaoId} onChange={(e) => setConteudo({ ...conteudo, secaoId: Number(e.target.value) })}><option value="">Selecione uma disciplina</option>{secoesConteudo.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}</select></label>
      <label>Bimestre<select value={conteudo.bimestre} onChange={(e) => setConteudo({ ...conteudo, bimestre: Number(e.target.value) })}>{[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}º Bimestre</option>)}</select></label>
      <label>Título<input required value={conteudo.titulo} onChange={(e) => setConteudo({ ...conteudo, titulo: e.target.value })} placeholder="Ex.: Princípio multiplicativo" /></label>
      <label>Descrição do conteúdo<textarea required rows="7" value={conteudo.texto} onChange={(e) => setConteudo({ ...conteudo, texto: e.target.value })} placeholder="Registre o que foi estudado e aprendido" /></label>
      <label>Ordem de exibição<input type="number" min="1" required value={conteudo.ordem} onChange={(e) => setConteudo({ ...conteudo, ordem: e.target.value })} /></label>
      <button className="publishButton" type="submit" disabled={!conteudo.secaoId}>SALVAR CONTEÚDO</button>
      {mensagemConteudo && <p className="adminMessage" role="status">{mensagemConteudo}</p>}
    </form></div>
    <button className="backButton" type="button" onClick={() => navigate('/')}>← VOLTAR PARA O PORTFÓLIO</button>
  </section>;
}

createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>);
