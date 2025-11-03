
const Stack = (props) => {
    const skills = props.skills;
    return (<section>
        <h3>
            Můj stack
        </h3>
        <div style={{display: "flex", alignItems: "center", flexDirection: "row",flexWrap: "wrap",gap: "10px"}}>
            {skills && skills.map((skill => {
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
    </section>)
}

export default Stack;