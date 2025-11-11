import {useEffect, useState} from "react";
import {getBio, getEducation, getProjects, getTechnologies, getWorkHistory} from "@/utils/DataExtractor";
import getConfig from "next/config";
import nextConfig from "../../next.config.mjs";
import Person from "@/pages/Person";
import Education from "@/pages/Education";
import Stack from "@/pages/Stack";
import Projects from "@/pages/Projects";
import Jobs from "@/pages/Jobs";

const { publicRuntimeConfig } = getConfig();

export default function Home() {
    const [graph, setGraph] = useState(null);

    const [bio, setBio] = useState(null);
    const [education, setEducation] = useState([]);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [workHistory, setWorkHistory] = useState([]);

    const basePath = nextConfig.basePath || "";
    // const basePath = "";

    useEffect(() => {
        const fetchGraph = async () => {
            const basePath = nextConfig.basePath || "";
            // const basePath = "";
            fetch(basePath + "/cv.jsonld").then(res => res.json()).then((json) => {setGraph(json)});
        }
        fetchGraph();
    }, []);

    useEffect(() => {
        if (graph) {
            getBio(graph).then(b => setBio(b));
            getEducation(graph).then(e => setEducation(e));
            getTechnologies(graph).then(e => setSkills(e));
            getWorkHistory(graph).then(e => setWorkHistory(e));
            getProjects(graph).then(e => setProjects(e));
        }
    }, [graph]);

  return (
          <main prefix="
            foaf: http://xmlns.com/foaf/0.1/
            schema: https://schema.org/
            cv: http://rdfs.org/resume-rdf/#term_
          " typeof="cv:CV" about={bio? bio["@id"]: ""}>
              <Person bio={bio}/>

              <div>
                  <Education education={education}/>

                  <Stack skills={skills}/>

                  <Projects projects={projects}/>
              {/* <Jobs workHistory={workHistory}/> */}
              </div>
          </main>
  );
}
