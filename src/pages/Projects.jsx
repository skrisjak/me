import {useEffect, useRef, useState} from "react";
import nextConfig from "../../next.config.mjs";

const Projects = (props) => {
    const projects = props.projects;
    const basePath = nextConfig.basePath || "";
    // const basePath = "";

    const [page, setPage] = useState(0);


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
                    //setPage(index);
                    setPage( ((index % projects.length)));
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
            setPage( ((index % projects.length)));

        }
    }

    const prevPage = useRef(page);

    useEffect(() => {
        document.getElementById("page"+prevPage.current)?.classList.remove("current");
        if (projects.length > 4) {
            const move = (page - prevPage.current);

            document.getElementById("pages")?.animate([
                    {transform: `translate(${move}rem,0)`}, {transform: "translate(0,0)"}],
                {duration: 300, easing: "ease-in-out"},
            );
        }
        document.getElementById("page"+page)?.classList.add("current");
        document.getElementById("page"+page)?.scrollIntoView({behavior:"smooth"});
        prevPage.current = page;
    }, [page]);

    return (
        <section>
            <h3>
                Projekty
            </h3>
            <div id="projectsContainer">
                <div id="projectWindow">
                    {projects && (projects.length > 1 ? [...projects, ...projects, ...projects] : projects).map((project, index) =>
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
                {projects && projects.length > 1 &&
                    <div id="pagination">
                        <div id="pages">
                        {projects.map((project, index) =>
                            <div className={"page" + (index===0? " current" : "")} id={"page"+index}></div>
                        )}
                        </div>
                    </div>
                }
            </div>
        </section>
    )
}

export default Projects;