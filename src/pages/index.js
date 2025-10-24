import {useEffect, useState} from "react";
import {getBio, getEducation, getProjects, getTechnologies, getWorkHistory} from "@/utils/DataExtractor";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export default function Home() {
    const [graph, setGraph] = useState(null);

    const [bio, setBio] = useState(null);
    const [education, setEducation] = useState([]);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [workHistory, setWorkHistory] = useState([]);
    const [page, setPage] = useState("");

    useEffect(() => {
        const fetchGraph = async () => {
            const basePath = publicRuntimeConfig.basePath || "";
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

    useEffect(() => {
        const container = document.getElementById("projectWindow");
        if (container) {
            if (container.childElementCount > 1 ) {
                container.children[projects.length].scrollIntoView({behavior:"instant"});

                const scrollHandler = () => {
                    const index = Math.round(container.scrollLeft / container.clientWidth);
                    if (index < projects.length) {
                        container.children[index + projects.length].scrollIntoView({behavior:"instant"});
                    } else if (index > projects.length*2) {
                        container.children[index - projects.length].scrollIntoView({behavior:"instant"});
                    }
                    setPage( ((index % projects.length) +1) +"/" + projects.length);
                }

                container.addEventListener("scrollend", scrollHandler);
            } else {
                document.getElementById("projectsSlider").style.display = "none";
            }
        }
    }, [projects]);



    const doScroll = (way) => {

        const container = document.getElementById("projectWindow");
        if (container) {
            let index = Math.round(container.scrollLeft / container.clientWidth);
            if (index < projects.length) {
                index += projects.length;
                container.children[index].scrollIntoView({behavior:"instant"});
            }
            if (index > projects.length*2) {
                index -= projects.length;
                container.children[index].scrollIntoView({behavior:"instant"});
            }
            container.children[index + way].scrollIntoView({behavior: "smooth"});
            setPage( ((index % projects.length) +1) +"/" + projects.length);

        }
    }

    useEffect(() => {
        const pagi = document.getElementById("pagination");
        if (pagi) {
            pagi.classList.toggle("active", true);
            setTimeout(() => {
                pagi.classList.toggle("active", false);
            }, 2000);
        }
    }, [page])


  return (
      graph && bio &&
          <main prefix="
            foaf: http://xmlns.com/foaf/0.1/
            schema: https://schema.org/
            cv: http://rdfs.org/resume-rdf/#term_
          " typeof="cv:CV" about={bio["@id"]}>
              <section typeof="foaf:Person schema:Person">
                  <div className="profileImage">
                  <img src={bio.image} alt="Profile image" onError={(e) => {e.target.src='/profileImage.png'; e.target.onerror=null}} property="foaf:img"/>
                  </div>
                  <div style={{padding:"10px"}}>
                  <h2>
                    <span property="foaf:firstName" style={{fontSize:"1.5em"}}>{bio.firstName}</span>
                    {" "}
                    <span property="foaf:familyName" style={{color: "#3a8def", fontSize:"2em"}}>{bio.familyName}</span>
                  </h2>
                      <div style={{display: "flex", flexDirection:"column", justifyContent:"space-between"}}>
                  <h4>
                    <span property="foaf:birthday">
                        <i className="fa-solid fa-calendar"></i>
                        {bio.birthday}
                    </span>
                  </h4>
                      <h4>
                          <i className="fa-solid fa-location-dot"></i>
                          <span property="schema:address">
                              {bio.address}
                          </span>
                      </h4>
                      <h4>
                          <a href={"tel:" + bio.telephone}>
                          <i className="fa-solid fa-phone"></i>
                          <span property="schema:telephone">
                              {bio.telephone}
                          </span>
                          </a>
                      </h4>
                      <h4>
                          <a href={"mailto:" + bio.email}>
                          <i className="fa-solid fa-envelope"></i>
                          <span property="schema:email">
                              {bio.email}
                          </span>
                          </a>
                      </h4>
                      </div>
                  </div>
              </section>

              <section>
                <h3>
                    Vzdělání
                </h3>
                      {education.map((eduEntry => {
                          return (
                              <div typeof="cv:Education" style={{paddingLeft:"8px", paddingRight:"8px"}} key={eduEntry["@id"]}>
                                  <h4 property="schema:name">
                                  <a href={eduEntry.link}>
                                      {eduEntry.name}
                                  </a>
                                  </h4>
                                  {eduEntry.description &&
                                  <ul>
                                      {eduEntry.description.map((eduDescription, index) =>
                                      <li property="cv:eduDescription" key={eduEntry["@id"] + index}>
                                          {eduDescription}
                                      </li>
                                      )}
                                  </ul>
                                  }
                              </div>
                          )
                      }))}
              </section>


              <section>
                  <h3>
                      Můj stack
                  </h3>
                  <div style={{display: "flex", alignItems: "center", flexDirection: "row",flexWrap: "wrap",gap: "10px"}}>
                      {skills.map((skill => {
                          return (
                              <div typeof="cv:Skill" key={skill["@id"]}>
                                  <a href={skill.link}>
                                    <img src={skill.image} alt="" height="32" width="32" className="skill"/>
                                    <span property="schema:name">
                                        {" " + skill.name}
                                    </span>
                                  </a>
                              </div>
                          )
                      }))}
                  </div>
              </section>

              <section>
                  <h3>
                      Projekty
                  </h3>
                  <div id="projectsContainer">
                      <button id="left" onClick={() => doScroll(-1)}>&lt;</button>
                      <div id="projectWindow">
                          {[...projects, ...projects, ...projects].map((project, index) =>
                              <div typeof="schema:Project" id={"project"+index} className={index >=projects.length && "hidden"} key={project["@id"]+index}>
                                  <h4 property="schema:name">
                                      {project.link.match("github") && <img src="/github-mark.svg" alt=""/>}
                                      {project.link.match("gitlab") && <img src="/gitlab-logo.svg" alt=""/>}
                                      <a href={project.link}>
                                        {project.name}
                                      </a>
                                  </h4>
                                  <div>
                                      <ul>
                                          {project.description?.map((description, index) =>
                                          <li property="schema:description" key={project["@id"] + "des" +index}>
                                              {description}
                                          </li>)}
                                          {project.publications?.map((publication, index) =>
                                          <li property="schema:workFeatured" key={project["@id"] + "wrk" +index}>
                                            <h4 style={{display:"inline"}}>
                                              <a href={publication?.link}>
                                                  {publication?.name}
                                              </a>
                                            </h4>
                                          </li>)}
                                      </ul>
                                  </div>
                              </div>
                          )}
                      </div>
                      <button id="right" onClick={() => doScroll(1)}>&gt;</button>
                      <span id="pagination">{page}</span>
                  </div>
              </section>

              <section>
                  <h3>
                      Pracovní zkušenosti
                  </h3>
                  {workHistory.map((job => {
                      return (
                          <div typeof="cv:WorkHistory" style={{paddingLeft:"8px", paddingRight:"8px"}} key={job["@id"]}>
                              <h4 property="cv:jobDescription">
                                  <a href={job.link}>
                                  {job.name}
                                  </a>
                              </h4>
                              {job.description &&
                                  <ul>
                                      <li property="cv:eduDescription">
                                          {job.description}
                                      </li>
                                  </ul>
                              }
                          </div>
                      )
                  }))}
              </section>

          </main>
  );
}
