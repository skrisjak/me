import {useEffect, useState} from "react";
import nextConfig from "../../next.config.mjs";

const Projects = (props) => {
    const projects = props.projects;
    const basePath = nextConfig.basePath || "";
    // const basePath = "";

    const [page, setPage] = useState("");


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
                const projectsSlider = document.getElementById("projectsSlider");
                if (projectsSlider) {
                    projectsSlider.style.display = "none";
                }
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
        <section>
            <h3>
                Projekty
            </h3>
            <div id="projectsContainer">
                <button id="left" onClick={() => doScroll(-1)}>&lt;</button>
                <div id="projectWindow">
                    {projects && [...projects, ...projects, ...projects].map((project, index) =>
                        <div typeof="schema:Project" id={"project"+index} className={index >=projects.length && "hidden"} key={project["@id"]+index}>
                            <h4 property="schema:name">
                                {project.link.match("github") && <img src={basePath+ "/github-mark.svg"} alt=""/>}
                                {project.link.match("gitlab") && <img src={basePath + "/gitlab-logo.svg"} alt=""/>}
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
    )
}

export default Projects;