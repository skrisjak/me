# Semantic CV

A lightweight, ontology-driven CV generator built with Next.js and GitHub Pages deployment.

The ontology is based on schema.org and resume-rdf, ensuring interoperability and reuse of existing vocabularies.

### Prerequisites
For local development, you need to have these programs installed
 - node package manager (npm)
 - Java 11 or higher

### CV source file
You have to create/edit file */public/cv.ttl,* which serves as data source for your cv.

***CV Bio***
```ttl
# Prefixes
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix schema: <https://schema.org/> .
@prefix cv: <http://rdfs.org/resume-rdf/#term_> .
@base  <https://johndoe.com/>.

# Person object
<> a foaf:Person, schema:Person, cv:CV, cv:Person;  
    # Name
    foaf:firstName "John";
    # Surname
    foaf:familyName "Doe";
    # Birthday
    foaf:birthday "11.09.2001";
    # Address
    schema:address "New York";
    # Phone number
    schema:telephone "505–503–4455";
    #Email
    schema:email "john.doe@gmail.com";
    #Image source url
    foaf:img <https://static.wikia.nocookie.net/doomspire-defense/images/3/33/John_Doe.png/revision/latest?cb=20241031204507> .
```

***Work History***
```ttl
# Previous employer object can be linked ->
<https://www.google.com/> a cv:CV_Entry, cv:WorkHistory ;
    # Job title
    schema:name "Google" ;
    # Start date
    cv:startDate "7/2019" ;
    # End date
    cv:endDate "9/2025" ;
    # Descriptions, can use multiple descriptions, but unpredictable ordering
    cv:jobDescription "HR specialist","Project leader" .
```

***Education***
```ttl
# Similar to work history
<https://www.harvard.edu/> a schema:EducationalOrganization, cv:Education ;
    schema:name "Harvard";
    #Multiple descriptions
    cv:eduDescription "Bachelor degree ", "Master degree" ;
    cv:startDate "9/2022" ;
    cv:endDate "6/2025" .
```

***Skills***
```ttl
# Even skills can be linked
<https://www.w3.org/RDF/> a schema:ComputerLanguage, cv:Skill ;
    schema:name "Semantic Web" ;
    cv:skillName "Semantic Web" ;
    # Skill logo/image
    schema:image <https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm8U7AGVOvLM-YbLe8fGD8cfqXmXQSY7umTQ&s> .
```

***Projects***
```ttl
# Project homepage or repository (github/gitlab)
<https://github.com/skrisjak/me> a schema:SoftwareSourceCode, schema:Project ;
    schema:codeRepository <https://github.com/skrisjak/me> ;
    schema:name "Semantic CV" ;
    schema:abstract "Semantic CV template" , "Build your resume as ontology" ;
    # Link other resources, such as publications, deployments, etc. 
    schema:workFeatured [ a schema:Article;
                          schema:name "Other resource";
                          schema:url <https://link.to.other.resource>
                        ] ,
                        [ a schema:Thesis;
                          schema:name "Other resource 2";
                          schema:url <https://link.to.other.resource2>
                        ].
```

With your CV created, you can now transfer it to jsonld using Apache Jena:
```bash
jena/bin/riot --output=jsonld public/cv.ttl > public/cv.jsonld
```

### Local development
CV was developed using Next.js, development server on *localhost:3000* can be started by running:
```bash
npm run dev
```

Root of view is standartly in */src/pages/index.js,* view is styled using */src/styles/globals.css.* 


#### /src/pages/index.js
```js
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
              {/* Parts of template can be left out */}
              {/* <Jobs workHistory={workHistory}/> */}
              </div>
          </main>
```

### Deployment
Project contains script, which is detected by github and deploys into GitHub pages. This requires configuration of Next by altering */next.config.mjs*
```js
const nextConfig = {
  reactStrictMode: true,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.jsonld$/,
            type: "json",
        });
        return config;
    },
    output: 'export',
    images: { unoptimized: true },
    basePath: '/me',    //change to path of the repository
    assetPrefix: '/me/',    //change to path of the repository
};

export default nextConfig;
```
