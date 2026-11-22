import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3333' : '')).replace(/\/$/, '');

export default function Senai() {
  const [projetos, setProjetos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const resposta = await fetch(`${API}/api/projetos/1`);
        if (!resposta.ok) throw new Error('Não foi possível carregar os projetos do SENAI.');
        const dados = await resposta.json();
        if (ativo) setProjetos(Array.isArray(dados) ? dados : []);
      } catch (e) {
        if (ativo) setErro(e.message || 'Erro ao conectar com a API.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregar();
    return () => { ativo = false; };
  }, []);

  return (
    <section className="page">
      <p className="tag">FORMAÇÃO TÉCNICA • INFORMÁTICA</p>
      <h1 className="sectionTitle">SENAI</h1>
      <p className="intro">Projetos, códigos e experiências desenvolvidos durante o curso de Informática.</p>
      <div className="sectionHeading"><h2>PROJETOS DESENVOLVIDOS</h2><Link to="/admin" className="textLink">ÁREA ADMINISTRATIVA →</Link></div>
      {carregando && <p className="hint">Carregando projetos...</p>}
      {erro && <p className="errorMessage">{erro} Verifique se o back-end está iniciado.</p>}
      {!carregando && !erro && projetos.length === 0 && <div className="empty">Ainda não há projetos publicados nesta formação.</div>}
      <div className="projectGrid">
        {projetos.map((p) => (
          <article className="project" key={p.id}>
            <div className="projectImg">{p.imagem ? <img src={p.imagem} alt={`Imagem do projeto ${p.titulo}`} /> : <>PROJETO<br />{String(p.id).padStart(2, '0')}</>}</div>
            <div>
              <small>{p.categoria || 'PROJETO'}</small>
              <h2>{p.titulo}</h2>
              <p>{p.descricao}</p>
              {p.tecnologias && <p><b>Tecnologias:</b> {p.tecnologias}</p>}
              <div className="links">
                {p.github && <a href={p.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
                {p.link && <a href={p.link} target="_blank" rel="noreferrer">Acessar projeto ↗</a>}
              </div>
            </div>
          </article>
        ))}
      </div>
      <Link className="backButton" to="/formacoes">← VOLTAR ÀS FORMAÇÕES</Link>
    </section>
  );
}
