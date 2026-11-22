import { Link } from 'react-router-dom';

export default function Inicio() {
  return (
    <section className="hero">
      <div className="star">✦</div>
      <div>
        <p className="tag">PORTFÓLIO INTEGRADO • 2026</p>
        <h1>Minha trajetória<br /><em>em projetos.</em></h1>
        <p>Um espaço para reunir trabalhos, aprendizados, registros e experiências do Ensino Médio.</p>
        <Link className="primary" to="/formacoes">ESCOLHER FORMAÇÃO →</Link>
      </div>
      <div className="sticker">Y2K<br /><small>digital scrapbook</small></div>
    </section>
  );
}
