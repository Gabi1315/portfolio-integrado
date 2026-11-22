import { Link } from 'react-router-dom';

export default function EscolhaFormacao() {
  return (
    <section className="page">
      <p className="tag">PORTFÓLIO INTEGRADO • FORMAÇÕES</p>
      <h1 className="sectionTitle">ESCOLHA SUA FORMAÇÃO</h1>
      <p className="intro">Selecione uma das formações para acessar os projetos, conteúdos e aprendizagens.</p>
      <div className="formacoesGrid">
        <Link className="formacaoCard" to="/senai">
          <small>01 / FORMAÇÃO TÉCNICA</small>
          <strong>SENAI</strong>
          <span>Informática</span>
          <b>ACESSAR →</b>
        </Link>
        <Link className="formacaoCard" to="/sesi">
          <small>02 / ENSINO MÉDIO</small>
          <strong>SESI</strong>
          <span>Ensino Médio</span>
          <b>ACESSAR →</b>
        </Link>
      </div>
    </section>
  );
}
