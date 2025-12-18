
const Education = (props) => {

    const education =  props.education;

    return (
        <section>
            <h3>
                Vzdělání
            </h3>
            {education && education.map((eduEntry => {
                return (
                    <div typeof="cv:Education" style={{paddingLeft:"8px", paddingRight:"8px"}} key={eduEntry["@id"]}>
                        <h4 property="schema:name">
                            <a href={eduEntry.link} target="_blank" rel="noopener noreferrer">
                                {eduEntry.name}
                            </a>
                        </h4>
                        <h6>
                           <span property="cv:startDate">
                               {eduEntry.startDate}
                           </span>
                            {" - "}
                            <span property="cv:endDate">
                                {eduEntry.endDate}
                            </span>
                        </h6>
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
    )
}

export default Education;