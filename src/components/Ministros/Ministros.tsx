import React from "react";

const dataUrl =
  "https://github.com/BoliviaMaes/bolivia-maes/raw/refs/heads/main/bolivia-maes.json";

async function Ministros() {
  const data = await fetch(dataUrl);
  const json = await data.json();

  const ministerios = json.entidades.filter((d) => d.tipo === "Ministerio");
  const autoridadesVigentes = json.autoridades.filter(
    (d) => d.hasta === undefined
  );
  const ministros = ministerios.map((ministerio) => {
    return {
      ministerio,
      autoridad: autoridadesVigentes.find(
        (autoridad) => autoridad.entidad[0] === ministerio.airtableId
      ),
    };
  });
  return (
    <div>
      <h2>Ministros</h2>
      <p>
        El gabinete ministerial del Estado Plurinacional de Bolivia está
        conformado por los siguientes ministros y ministras.
      </p>
      <ul>
        {ministros.map(({ ministerio, autoridad }, i) => (
          <li key={ministerio.airtableId}>
            {autoridad === undefined ? (
              <p>Falta la informacion para el {ministerio.nombre}</p>
            ) : (
              <>
                <h3>{autoridad["nombre (from persona)"]}</h3>
                <p>{autoridad.cargo}</p>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Ministros;
