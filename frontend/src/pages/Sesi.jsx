import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3333' : '')).replace(/\/$/, '');

export default function Sesi() {
  const [secoes, setSecoes] = useState([]);
  const [conteudos, setConteudos] = useState([]);
  const [secaoAtiva, setSecaoAtiva] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const [resSecoes, resConteudos] = await Promise.all([
          fetch(`${API}/api/formacoes/secoes/2`),
          fetch(`${API}/api/conteudos/2`)
        ]);
        if (!resSecoes.ok || !resConteudos.ok) throw new Error('Não foi possível carregar os conteúdos do SESI.');
        const [dadosSecoes, dadosConteudos] = await Promise.all([resSecoes.json(), resConteudos.json()]);
        if (ativo) {
          const listaSecoes = Array.isArray(dadosSecoes) ? dadosSecoes : [];
          setSecoes(listaSecoes);
          setConteudos(Array.isArray(dadosConteudos) ? dadosConteudos : []);
          if (listaSecoes.length) setSecaoAtiva(String(listaSecoes[0].id));
        }
      } catch (e) {
        if (ativo) setErro(e.message || 'Erro ao conectar com a API.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregar();
    return () => { ativo = false; };
  }, []);

  const conteudosDaSecao = conteudos.filter((item) => String(item.secaoId) === secaoAtiva);
  const bimestres = [1, 2, 3, 4];

  return (
    <section className="page">
      <p className="tag">ENSINO MÉDIO • SESI</p>
      <h1 className="sectionTitle">SESI</h1>
      <p className="intro">Conteúdos, atividades e aprendizagens construídas nas disciplinas do Ensino Médio.</p>
      {carregando && <p className="hint">Carregando disciplinas...</p>}
      {erro && <p className="errorMessage">{erro} Verifique se o back-end está iniciado.</p>}
      {!carregando && !erro && (
        <>
          {secoes.length === 0 ? <div className="empty">Nenhuma disciplina foi cadastrada.</div> : (
            <>
              <div className="subjectTabs" aria-label="Disciplinas">
                {secoes.map((secao) => (
                  <button key={secao.id} className={secaoAtiva === String(secao.id) ? 'subjectTab active' : 'subjectTab'} onClick={() => setSecaoAtiva(String(secao.id))}>
                    {secao.nome}
                  </button>
                ))}
              </div>
              <h2 className="subjectTitle">{secoes.find((s) => String(s.id) === secaoAtiva)?.nome}</h2>
              {bimestres.map((bimestre) => {
                const lista = conteudosDaSecao.filter((item) => Number(item.bimestre) === bimestre);
                return (
                  <section className="bimestre" key={bimestre}>
                    <h3>{bimestre}º BIMESTRE</h3>
                    {lista.length ? lista.map((item) => (
                      <article className="contentCard" key={item.id}>
                        <h4>{item.titulo}</h4>
                        <p>{item.texto}</p>
                      </article>
                    )) : <p className="hint">Nenhum conteúdo publicado neste bimestre.</p>}
                  </section>
                );
              })}
            </>
          )}
        </>
      )}
      <Link className="backButton" to="/formacoes">← VOLTAR ÀS FORMAÇÕES</Link>
    </section>
  );
}
