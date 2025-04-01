const dataUrl =
  "https://github.com/BoliviaMaes/bolivia-maes/raw/refs/heads/main/bolivia-maes.json";

interface Person {
  id: string;
  name: string;
  gender: "m" | "f";
}

interface Entity {
  id: string;
  name: string;
  kind: string;
  from?: Date;
  to?: Date;
  isActive: boolean;
}

interface Authority {
  id: string;
  person: Person;
  entity: Entity;
  position: string;
  from: Date;
  to?: Date;
  inCharge: boolean;
}

interface Data {
  personsLU: Map<string, Person>;
  entitiesLU: Map<string, Entity>;
  authoritiesLU: Map<string, Authority>;
}

export async function fetchData(): Promise<Data> {
  const data = await fetch(dataUrl);
  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }
  const json = await data.json();

  const personas: unknown[] = json.personas ?? [];
  const persons = personas.map(parsePerson);
  const personsLU = new Map(persons.map((person) => [person.id, person]));

  const entidades: unknown[] = json.entidades ?? [];
  const entities = entidades.map(parseEntity);
  const entitiesLU = new Map(entities.map((entity) => [entity.id, entity]));

  const autoridades: unknown[] = json.autoridades ?? [];
  const authorities = autoridades.map((autoridad) =>
    parseAuthority(autoridad, { entitiesLU, personsLU })
  );
  const authoritiesLU = new Map(
    authorities.map((authority) => [authority.id, authority])
  );

  return {
    personsLU,
    entitiesLU,
    authoritiesLU,
  };
}

export function getMinisterios({
  data,
}: {
  data: Data;
}): { entity: Entity; currentAuthority?: Authority }[] {
  return [...data.entitiesLU.values()]
    .filter((d) => d.kind === "Ministerio")
    .map((entity) => {
      const currentAuthorities = [...data.authoritiesLU.values()].filter(
        (authority) => authority.entity.id === entity.id && authority.inCharge
      );
      if (currentAuthorities.length > 1) {
        throw new Error(`Entity ${entity.id} has more than one authority`);
      }
      const currentAuthority =
        currentAuthorities.length === 1 ? currentAuthorities[0] : undefined;
      return { entity, currentAuthority };
    });
}

// For reference

// interface AirtablePerson {
//     airtableId: string;
//     nombre: string;
//     genero: string;
//     // fotos: string[];
//     // autoridades: string[];
//     // id: string;
//   }

function parsePerson(person: unknown): Person {
  // Check
  if (typeof person !== "object" || person === null) {
    throw new Error("person is not an object");
  }
  if (!("airtableId" in person) || typeof person.airtableId !== "string") {
    throw new Error("'airtableId' not defined in person");
  }
  if (!("nombre" in person) || typeof person.nombre !== "string") {
    throw new Error("'nombre' not defined in person");
  }
  if (
    !("genero" in person) ||
    (person.genero !== "Hombre" && person.genero !== "Mujer")
  ) {
    throw new Error("'genero' not defined in person");
  }
  const { airtableId, nombre, genero } = person;
  // Fill the object
  return {
    id: airtableId,
    name: nombre,
    gender: genero === "Hombre" ? "m" : "f",
  };
}

//   interface AirtableEntity {
//     airtableId: string;
//     nombre: string;
//     tipo: string;
//     // id: string;
//     // sigla?: string;
//     // eleccion_mae?: string;
//     // dependencia: string[];
//     // desde?: string;
//     // hasta?: string;
//     // sucesoras?: string[];
//     // webpage?: string;
//     // autoridades?: string[];
//     // fuente_inicio?: string;
//   }

function parseEntity(entity: unknown): Entity {
  // Check
  if (typeof entity !== "object" || entity === null) {
    throw new Error("entity is not an object");
  }
  if (!("airtableId" in entity) || typeof entity.airtableId !== "string") {
    throw new Error("'airtableId' not defined in entity or invalid");
  }
  if (!("nombre" in entity) || typeof entity.nombre !== "string") {
    throw new Error("'nombre' not defined in entity or invalid");
  }
  if (!("tipo" in entity) || typeof entity.tipo !== "string") {
    throw new Error("'tipo' not defined in entity or invalid");
  }
  const { airtableId, nombre, tipo } = entity;
  const desde = "desde" in entity ? entity.desde : undefined;
  if (desde !== undefined && typeof desde !== "string") {
    throw new Error("'desde' is invalid in entity");
  }
  const from = desde ? new Date(desde) : undefined;
  const hasta = "hasta" in entity ? entity.hasta : undefined;
  if (hasta !== undefined && typeof hasta !== "string") {
    throw new Error("'hasta' is invalid in entity");
  }
  const to = hasta ? new Date(hasta) : undefined;
  const isActive = to === undefined;
  // Fill the object
  return {
    id: airtableId,
    name: nombre,
    kind: tipo,
    from,
    to,
    isActive,
  };
}

//   interface AirtableAuthority {
//     airtableId: string;
//     persona: string[];
//     entidad: string[];
//     cargo: string;
//     desde: string;
//     hasta?: string;
//     // id: string;
//     // cause_fin?: string;
//     // sucesora?: string;
//     // fuente_inicio?: string;
//     // tweet_inicio?: string;
//     // fuente_fin?: string;
//     // tweet_fin?: string;
//   }

function parseAuthority(
  authority: unknown,
  {
    entitiesLU,
    personsLU,
  }: {
    entitiesLU: Map<string, Entity>;
    personsLU: Map<string, Person>;
  }
): Authority {
  // Check
  if (typeof authority !== "object" || authority === null) {
    throw new Error("authority is not an object");
  }
  if (
    !("airtableId" in authority) ||
    typeof authority.airtableId !== "string"
  ) {
    throw new Error("'airtableId' not defined in authority");
  }
  if (
    !("persona" in authority) ||
    !Array.isArray(authority.persona) ||
    authority.persona.length !== 1 ||
    typeof authority.persona[0] !== "string"
  ) {
    throw new Error("'persona' not defined in authority");
  }
  if (
    !("entidad" in authority) ||
    !Array.isArray(authority.entidad) ||
    authority.entidad.length !== 1 ||
    typeof authority.entidad[0] !== "string"
  ) {
    throw new Error("'entidad' not defined in authority");
  }
  if (!("cargo" in authority) || typeof authority.cargo !== "string") {
    throw new Error("'cargo' not defined in authority");
  }
  if (!("desde" in authority) || typeof authority.desde !== "string") {
    throw new Error("'desde' not defined in authority");
  }
  const hasta = "hasta" in authority ? authority.hasta : undefined;
  if (hasta !== undefined && typeof hasta !== "string") {
    throw new Error("'hasta' is defined in authority but invalid");
  }
  const { airtableId, persona, entidad, cargo, desde } = authority;

  // Get the entity and person
  const entity = entitiesLU.get(entidad[0]);
  const person = personsLU.get(persona[0]);
  // Check if the entity and person exist
  if (entity === undefined) {
    throw new Error(`Entity ${entidad[0]} not found`);
  }
  if (person === undefined) {
    throw new Error(`Person ${persona[0]} not found`);
  }

  // Get the dates
  const from = new Date(desde);
  const to = hasta !== undefined ? new Date(hasta) : undefined;

  // Fill the object
  return {
    id: airtableId,
    person,
    entity,
    position: cargo,
    from,
    to,
    inCharge: to === undefined,
  };
}

//   const authorities: Map<string, Authority> = new Map(
//     (json.autoridades ?? []).map(
//       ({
//         airtableId,
//         persona,
//         entidad,
//         cargo,
//         desde,
//         hasta,
//       }: AirtableAuthority) => {
//         return [
//           airtableId,
//           {
//             id: airtableId,
//             person: persons.get(persona[0])!,
//             entity: entities.get(entidad[0])!,
//             position: cargo,
//             from: new Date(desde),
//             to: hasta ? new Date(hasta) : undefined,
//             inPlace: hasta === undefined,
//           },
//         ];
//       }
//     )
//   );
