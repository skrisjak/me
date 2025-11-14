import nextConfig from "../../next.config.mjs";

const Person = (props) => {
    const bio = props.bio;

    return (
        <section typeof="foaf:Person schema:Person">
            <div className="profileImage">
                <img src={bio? bio.image : (nextConfig.basePath || "" +"/profileImage.png") } alt="Profile image" onError={(e) => {e.target.src=(nextCongig.basePath || "") + '/profileImage.png'; e.target.onerror=null}} property="foaf:img"/>
            </div>
            <div style={{padding:"10px"}}>
                <h2>
                    <span property="foaf:firstName" style={{fontSize:"1.5em"}}>{bio && bio.firstName}</span>
                    {" "}
                    <span property="foaf:familyName" style={{color: "#3a8def", fontSize:"2em"}}>{bio && bio.familyName}</span>
                </h2>
                <div style={{display: "flex", flexDirection:"column", justifyContent:"space-between"}}>
                    <h4>
                    <span property="foaf:birthday">
                        <i className="fa-solid fa-calendar"></i>
                        {bio && bio.birthday}
                    </span>
                    </h4>
                    <h4>
                        <i className="fa-solid fa-location-dot"></i>
                        <span property="schema:address">
                              {bio && bio.address}
                          </span>
                    </h4>
                    <h4>
                        {bio &&
                        <a href={"tel:" + bio.telephone}>
                            <i className="fa-solid fa-phone"></i>
                            <span property="schema:telephone">
                              {bio.telephone}
                          </span>
                        </a>
                        }
                    </h4>
                    <h4>
                        {bio &&
                        <a href={"mailto:" + bio.email}>
                            <i className="fa-solid fa-envelope"></i>
                            <span property="schema:email">
                              {bio.email}
                          </span>
                        </a>
                        }
                    </h4>
                </div>
            </div>
        </section>
    )
}

export default Person;
