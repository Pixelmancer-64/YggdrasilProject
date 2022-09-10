import type { NextPage } from "next";
import { SyntheticEvent, useEffect, useState, useContext } from "react";
import { Container } from "../../components/styled/styled-index";
import { AuthContext } from "../../components/AuthContext";
import Router from "next/router";

export async function getStaticProps() {
  const groupsRes = await fetch(
    `http://localhost:3000/django/herbarium/groups/getAll`
  );

  const sun_preferencesRes = await fetch(
    `http://localhost:3000/django/herbarium/sun_preferences/getAll`
  );

  const soilsRes = await fetch(
    `http://localhost:3000/django/herbarium/soils/getAll`
  );

  const groups = (await groupsRes.json()).context;
  const sun_preferences = (await sun_preferencesRes.json()).context;
  const soils = (await soilsRes.json()).context;

  return { props: { groups, sun_preferences, soils } };
}

type SelectType = {
  name: string;
  id: string;
  data: any;
  value: string | undefined;
  keyIndex: string | number;
  valueIndex: string | number;
  handleChange: any;
};

function Select({
  name,
  id,
  data,
  value,
  keyIndex,
  valueIndex,
  handleChange,
}: SelectType) {
  return (
    <select
      name={name}
      id={id}
      value={String(value)}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option disabled value={"undefined"}>
        -- select an option --
      </option>
      {data &&
        data.map((option: any) => (
          <option
            key={`${option[valueIndex]}-${option[keyIndex]}`}
            value={option[keyIndex]}
          >
            {option[valueIndex]}
          </option>
        ))}
    </select>
  );
}

const Add: NextPage = ({ groups, sun_preferences, soils }: any) => {
  const { isAuthenticated, CsrfToken } = useContext(AuthContext);

  const [popular_name, setPopular_name] = useState("");
  const [custom_name, setCustom_name] = useState("");
  const [complementary_name, setComplementary_name] = useState("");

  const [soil_preference, setSoil_preference] = useState();
  const [sun_preference, setSun_preference] = useState();

  const [species, setSpecies] = useState();
  const [genus, setGenus] = useState();
  const [family, setFamily] = useState();
  const [group, setGroup] = useState();

  const [speciesData, setSpeciesData] = useState();
  const [genusData, setGenusData] = useState();
  const [familyData, setFamilyData] = useState();

  async function submitForm(e: SyntheticEvent) {
    e.preventDefault();

    if (CsrfToken && isAuthenticated) {
      const headers = new Headers({
        "X-CSRFToken": CsrfToken,
      });

      const res = await fetch(
        "http://localhost:3000/django/herbarium/plants/add",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            popular_name,
            custom_name,
            complementary_name,
            soil_preference,
            sun_preference,
            species,
          }),
        }
      );
      if (res.ok) {
        Router.push("/");
      } else {
        const data = await res.json();
        console.log(data);
      }
    } else {
      console.log("tá querendo me enganar fdp?");
    }
  }

  useEffect(() => {
    if (group) {
      (async () => {
        const response = await fetch(
          `http://localhost:3000/django/herbarium/${group}`
        );
        const data = (await response.json()).context;
        setFamilyData(data);
        setFamily(undefined);
      })();
    }
  }, [group]);

  useEffect(() => {
    if (family && group) {
      (async () => {
        const response = await fetch(
          `http://localhost:3000/django/herbarium/${group}/${family}`
        );
        const data = (await response.json()).context;
        setGenusData(data);
        setGenus(undefined);
      })();
    }
  }, [family, group]);

  useEffect(() => {
    if (genus && family && group) {
      (async () => {
        const response = await fetch(
          `http://localhost:3000/django/herbarium/${group}/${family}/${genus}`
        );
        const data = (await response.json()).context;
        setSpeciesData(data);
        setSpecies(undefined);
      })();
    }
  }, [genus, family, group]);

  return (
    <Container>
      <form method="POST" onSubmit={submitForm}>
        <label htmlFor="group">Group</label>
        <Select
          name="group"
          id="group"
          data={groups}
          value={group}
          keyIndex="id"
          valueIndex="name"
          handleChange={setGroup}
        ></Select>

        <label htmlFor="group">Family</label>
        <Select
          name="family"
          id="family"
          data={familyData}
          value={family}
          keyIndex="id"
          valueIndex="name"
          handleChange={setFamily}
        ></Select>

        <label htmlFor="genus">Genus</label>
        <Select
          name="genus"
          id="genus"
          data={genusData}
          value={genus}
          keyIndex="id"
          valueIndex="name"
          handleChange={setGenus}
        ></Select>

        <label htmlFor="genus">Species</label>
        <Select
          name="species"
          id="species"
          data={speciesData}
          value={species}
          keyIndex="id"
          valueIndex="name"
          handleChange={setSpecies}
        ></Select>

        <label htmlFor="soil">Soil preference</label>
        <Select
          name="soil"
          id="soil"
          data={soils}
          value={soil_preference}
          keyIndex="id"
          valueIndex="name"
          handleChange={setSoil_preference}
        ></Select>

        <label htmlFor="sun_preference">Sun preference</label>
        <Select
          name="sun_preference"
          id="sun_preference"
          data={sun_preferences}
          value={sun_preference}
          keyIndex="id"
          valueIndex="name"
          handleChange={setSun_preference}
        ></Select>

        <label htmlFor="popular_name">Popular name</label>
        <input
          type="text"
          id="popular_name"
          name="popular_name"
          value={popular_name}
          onChange={(e) => setPopular_name(e.target.value)}
        />

        <label htmlFor="custom_name">Custom name</label>
        <input
          type="text"
          id="custom_name"
          name="custom_name"
          value={custom_name}
          onChange={(e) => setCustom_name(e.target.value)}
        />

        <label htmlFor="complementary_name">Complementary name</label>
        <input
          type="text"
          id="custom_name"
          name="custom_name"
          value={complementary_name}
          onChange={(e) => setComplementary_name(e.target.value)}
        />

        <button>ENVIAR</button>
      </form>
    </Container>
  );
};

export default Add;