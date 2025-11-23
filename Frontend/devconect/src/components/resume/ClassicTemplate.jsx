import React from "react";

const ClassicTemplate = ({ resumeData }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = resumeData;

    return (
        <div className="bg-white text-black w-full max-w-4xl mx-auto shadow-2xl p-12" id="resume-content">
            {}
            <div className="text-center border-b-2 border-black pb-4 mb-6">
                <h1 className="text-4xl font-bold mb-2">{personalInfo?.fullName || "YOUR NAME"}</h1>

                <div className="flex flex-wrap justify-center gap-3 text-sm mt-3">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>•</span>}
                    {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo?.location && <span>•</span>}
                    {personalInfo?.location && <span>{personalInfo.location}</span>}
                </div>

                <div className="flex flex-wrap justify-center gap-3 text-sm mt-2">
                    {personalInfo?.website && <span>{personalInfo.website}</span>}
                    {personalInfo?.linkedin && <span>•</span>}
                    {personalInfo?.linkedin && <span>{personalInfo.linkedin}</span>}
                    {personalInfo?.github && <span>•</span>}
                    {personalInfo?.github && <span>{personalInfo.github}</span>}
                </div>
            </div>

            {}
            {summary && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold uppercase mb-2 border-b border-black">
                        Professional Summary
                    </h2>
                    <p className="text-gray-800 leading-relaxed">{summary}</p>
                </div>
            )}

            {}
            {experience && experience.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold uppercase mb-2 border-b border-black">
                        Work Experience
                    </h2>
                    {experience.map((exp, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-start mb-1">
                                <div>
                                    <h3 className="font-bold">{exp.position}</h3>
                                    <p className="italic">{exp.company}{exp.location && `, ${exp.location}`}</p>
                                </div>
                                <p className="text-sm">
                                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                </p>
                            </div>
                            {exp.description && (
                                <p className="text-gray-800 mt-1 leading-relaxed">{exp.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {}
            {education && education.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold uppercase mb-2 border-b border-black">
                        Education
                    </h2>
                    {education.map((edu, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-start mb-1">
                                <div>
                                    <h3 className="font-bold">{edu.degree}</h3>
                                    <p className="italic">{edu.institution}</p>
                                    {edu.field && <p className="text-sm">{edu.field}</p>}
                                </div>
                                <div className="text-right text-sm">
                                    <p>{edu.startDate} - {edu.endDate}</p>
                                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                                </div>
                            </div>
                            {edu.description && (
                                <p className="text-gray-800 mt-1 leading-relaxed">{edu.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {}
            {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold uppercase mb-2 border-b border-black">
                        Skills
                    </h2>
                    {skills.technical && skills.technical.length > 0 && (
                        <div className="mb-2">
                            <span className="font-bold">Technical: </span>
                            <span>{skills.technical.join(", ")}</span>
                        </div>
                    )}
                    {skills.soft && skills.soft.length > 0 && (
                        <div>
                            <span className="font-bold">Soft Skills: </span>
                            <span>{skills.soft.join(", ")}</span>
                        </div>
                    )}
                </div>
            )}

            {}
            {projects && projects.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold uppercase mb-2 border-b border-black">
                        Projects
                    </h2>
                    {projects.map((project, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold">{project.title}</h3>
                                {(project.startDate || project.endDate) && (
                                    <p className="text-sm">
                                        {project.startDate} - {project.endDate}
                                    </p>
                                )}
                            </div>
                            {project.description && (
                                <p className="text-gray-800 mt-1 leading-relaxed">{project.description}</p>
                            )}
                            {project.techStack && project.techStack.length > 0 && (
                                <p className="text-sm mt-1">
                                    <span className="font-bold">Technologies: </span>
                                    {project.techStack.join(", ")}
                                </p>
                            )}
                            {(project.liveLink || project.githubLink) && (
                                <p className="text-sm mt-1">
                                    {project.liveLink && <span>Live: {project.liveLink}</span>}
                                    {project.liveLink && project.githubLink && <span> | </span>}
                                    {project.githubLink && <span>GitHub: {project.githubLink}</span>}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {}
            {certifications && certifications.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold uppercase mb-2 border-b border-black">
                        Certifications
                    </h2>
                    {certifications.map((cert, index) => (
                        <div key={index} className="mb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold">{cert.name}</h3>
                                    <p className="italic">{cert.issuer}</p>
                                    {cert.credentialId && (
                                        <p className="text-sm">Credential ID: {cert.credentialId}</p>
                                    )}
                                </div>
                                <p className="text-sm">{cert.date}</p>
                            </div>
                            {cert.link && (
                                <p className="text-sm mt-1">Certificate: {cert.link}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {}
            {languages && languages.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold uppercase mb-2 border-b border-black">
                        Languages
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                        {languages.map((lang, index) => (
                            <div key={index}>
                                <span className="font-bold">{lang.name}:</span> {lang.proficiency}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassicTemplate;
