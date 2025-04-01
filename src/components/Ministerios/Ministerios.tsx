import React from "react";
import { fetchData, getMinisterios } from "@/lib/data";

async function Ministros() {
  const data = await fetchData();
  const ministerios = getMinisterios({ data });

  return (
    <div>
      <h2>Ministerios</h2>
      <p>
        El gabinete ministerial del Estado Plurinacional de Bolivia está
        conformado por los siguientes ministros y ministras.
      </p>
      <ul>
        {ministerios.map(({ entity, currentAuthority }) => (
          <li key={entity.id}>
            {currentAuthority === undefined ? (
              <p>
                {entity.name} - Falta la información o el puesto está vacante.
              </p>
            ) : (
              <>
                <h3>{currentAuthority.person.name}</h3>
                <p>{currentAuthority.position}</p>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Ministros;
