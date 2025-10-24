import jsonld from 'jsonld';

const getBio = async (data) => {
    const graph = await jsonld.flatten(data);
    const bio = graph.find(obj => obj["@type"] && obj["@type"].includes("https://schema.org/Person"));
    return await jsonld.compact(bio, {
        firstName: "http://xmlns.com/foaf/0.1/firstName",
        familyName: "http://xmlns.com/foaf/0.1/familyName",
        image: {"@id": "http://xmlns.com/foaf/0.1/img", "@type": "@id"},
        birthday: "http://xmlns.com/foaf/0.1/birthday",
        address: "https://schema.org/address",
        telephone: "https://schema.org/telephone",
        email: "https://schema.org/email",
    });
}

const getEducation = async (data) => {
    const graph = await jsonld.flatten(data);

    const education = graph.filter(obj =>
        obj["@type"]?.includes("http://rdfs.org/resume-rdf/#term_Education")
    );

    const context = {
        "@context": {
            name: "https://schema.org/name",
            description: {
                "@id": "http://rdfs.org/resume-rdf/#term_eduDescription",
                "@container": "@set"
            },
            link: "@id"
        }
    };

    const compacted = await jsonld.compact({ "@graph": education }, context);
    return Array.isArray(compacted) ? compacted : [compacted];
};

const getTechnologies = async (data) => {
    const graph = await jsonld.flatten(data);

    const skills = graph.filter(obj =>
        obj["@type"]?.includes("http://rdfs.org/resume-rdf/#term_Skill")
    );

    const context = {
            name: "https://schema.org/name",
            image: {
                "@id" : "https://schema.org/image",
                "@type":"@id"
            },
            link: "@id"
    };

    const compacted = await jsonld.compact({ "@graph": skills }, context);
    return compacted["@graph"];
};

const getWorkHistory = async (data) => {
    const graph = await jsonld.flatten(data);

    const work = graph.filter(obj =>
        obj["@type"]?.includes("http://rdfs.org/resume-rdf/#term_WorkHistory")
    );

    const context = {
        "@context": {
            name: "https://schema.org/name",
            description: {
                "@id": "http://rdfs.org/resume-rdf/#term_jobDescription",
                "@container": "@set"
            },
            link: "@id"
        }
    };

    const compacted = await jsonld.compact({ "@graph": work }, context);
    return Array.isArray(compacted) ? compacted : [compacted];
}

const getProjects = async (data) => {
    const graph = await jsonld.flatten(data);

    const context = {
        "@context": {
            name: "https://schema.org/name",
            description: { "@id": "https://schema.org/abstract", "@container": "@set" },
            publications: { "@id": "https://schema.org/workFeatured", "@container": "@set" },
            link: "@id",
        }
    };
    
    const compacted = await jsonld.compact({ "@graph": graph }, context);

    const projectList = compacted["@graph"].filter(
        item => item["@type"]?.includes("https://schema.org/Project")
    );

    console.log(projectList);

    const compactedPublications =  await jsonld.compact({ "@graph": graph }, {
        "@context": {
            name: "https://schema.org/name",
            link: {"@id":"https://schema.org/url", "@type":"@id"}
        }}
    );
    projectList.forEach(project => {

        project.publications = project.publications?.map((p) => {
            return compactedPublications["@graph"].find(a => a["@id"] === p.link);
        });
    })


    return projectList;
};


export {getBio, getEducation, getTechnologies, getWorkHistory, getProjects};