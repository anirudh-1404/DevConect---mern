import React from "react";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase, GraduationCap, Code, Award, Languages } from "lucide-react";

const ModernTemplate = ({ resumeData }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = resumeData;

    return (
        <div className="bg-white text-gray-900 w-full max-w-4xl mx-auto shadow-2xl" id="resume-content">

            <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white p-8">
                <h1 className="text-4xl font-bold mb-2">{personalInfo?.fullName || "Your Name"}</h1>

                <div className="flex flex-wrap gap-4 text-sm mt-4">
                    {personalInfo?.email && (
                        <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{personalInfo.email}</span>
                        </div>
                    )}
                    {personalInfo?.phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo?.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{personalInfo.location}</span>
                        </div>
                    )}
                    {personalInfo?.website && (
                        <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            <span>{personalInfo.website}</span>
                        </div>
                    )}
                    {personalInfo?.linkedin && (
                        <div className="flex items-center gap-1">
                            <Linkedin className="w-4 h-4" />
                            <span>{personalInfo.linkedin}</span>
                        </div>
                    )}
                    {personalInfo?.github && (
                        <div className="flex items-center gap-1">
                            <Github className="w-4 h-4" />
                            <span>{personalInfo.github}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-8">

                {summary && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-cyan-700 mb-3 border-b-2 border-cyan-700 pb-2">
                            Professional Summary
                        </h2>
                        <p className="text-gray-700 leading-relaxed">{summary}</p>
                    </div>
                )}


                {experience && experience.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-cyan-700 mb-3 border-b-2 border-cyan-700 pb-2 flex items-center gap-2">
                            <Briefcase className="w-6 h-6" />
                            Work Experience
                        </h2>
                        {experience.map((exp, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                                        <p className="text-cyan-600 font-semibold">{exp.company}</p>
                                        {exp.location && <p className="text-gray-600 text-sm">{exp.location}</p>}
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                    </p>
                                </div>
                                {exp.description && (
                                    <p className="text-gray-700 mt-2 leading-relaxed">{exp.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}


                {education && education.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-cyan-700 mb-3 border-b-2 border-cyan-700 pb-2 flex items-center gap-2">
                            <GraduationCap className="w-6 h-6" />
                            Education
                        </h2>
                        {education.map((edu, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                                        <p className="text-cyan-600 font-semibold">{edu.institution}</p>
                                        {edu.field && <p className="text-gray-600 text-sm">{edu.field}</p>}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-600 text-sm">
                                            {edu.startDate} - {edu.endDate}
                                        </p>
                                        {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                                    </div>
                                </div>
                                {edu.description && (
                                    <p className="text-gray-700 mt-2 leading-relaxed">{edu.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}


                {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-cyan-700 mb-3 border-b-2 border-cyan-700 pb-2 flex items-center gap-2">
                            <Code className="w-6 h-6" />
                            Skills
                        </h2>
                        {skills.technical && skills.technical.length > 0 && (
                            <div className="mb-3">
                                <h3 className="font-semibold text-gray-900 mb-2">Technical Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.technical.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {skills.soft && skills.soft.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Soft Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.soft.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}


                {projects && projects.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-cyan-700 mb-3 border-b-2 border-cyan-700 pb-2">
                            Projects
                        </h2>
                        {projects.map((project, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                                    {(project.startDate || project.endDate) && (
                                        <p className="text-gray-600 text-sm">
                                            {project.startDate} - {project.endDate}
                                        </p>
                                    )}
                                </div>
                                {project.description && (
                                    <p className="text-gray-700 mt-1 leading-relaxed">{project.description}</p>
                                )}
                                {project.techStack && project.techStack.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {project.techStack.map((tech, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-4 mt-2 text-sm">
                                    {project.liveLink && (
                                        <a href={project.liveLink} className="text-cyan-600 hover:underline">
                                            Live Demo
                                        </a>
                                    )}
                                    {project.githubLink && (
                                        <a href={project.githubLink} className="text-cyan-600 hover:underline">
                                            GitHub
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {certifications && certifications.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-cyan-700 mb-3 border-b-2 border-cyan-700 pb-2 flex items-center gap-2">
                            <Award className="w-6 h-6" />
                            Certifications
                        </h2>
                        {certifications.map((cert, index) => (
                            <div key={index} className="mb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{cert.name}</h3>
                                        <p className="text-cyan-600 font-semibold">{cert.issuer}</p>
                                        {cert.credentialId && (
                                            <p className="text-gray-600 text-sm">ID: {cert.credentialId}</p>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm">{cert.date}</p>
                                </div>
                                {cert.link && (
                                    <a href={cert.link} className="text-cyan-600 hover:underline text-sm">
                                        View Certificate
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}


                {languages && languages.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-cyan-700 mb-3 border-b-2 border-cyan-700 pb-2 flex items-center gap-2">
                            <Languages className="w-6 h-6" />
                            Languages
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {languages.map((lang, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-900">{lang.name}</span>
                                    <span className="text-gray-600 text-sm">{lang.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModernTemplate;
