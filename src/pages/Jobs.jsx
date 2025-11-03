 const Jobs =(props) => {
    const workHistory = props.workHistory;

    return (
        <section>
            <h3>
                Pracovní zkušenosti
            </h3>
            {workHistory && workHistory.map((job => {
                return (
                    <div typeof="cv:WorkHistory" style={{paddingLeft:"8px", paddingRight:"8px"}} key={job["@id"]}>
                        <h4 property="cv:jobDescription">
                            <a href={job.link}>
                                {job.name}
                            </a>
                        </h4>
                        <h6>
                           <span property="cv:startDate">
                               {job.startDate}
                           </span>
                            {" - "}
                            <span property="cv:endDate">
                                {job.endDate}
                            </span>
                        </h6>
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
    )
 }

 export default Jobs;