import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubjectAPI from "../../api/subjectAPI";
import SubjectCard from "../../components/SubjectCard/SubjectCard";
import Graph from "../../components/KnowleadgeGraph";

function SubjectsPage() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    SubjectAPI.getAll()
      .then((response) => {
        const subjectsWithId = response.data.map((subject) => ({
          name: subject.name,
          id: subject.id,
        }));
        setSubjects(subjectsWithId);
      })
      .catch((error) => {
        console.error("Error fetching subjects");
      });
  }, []);

  const handleSubjectClick = (subject) => {
    navigate(`/user/Chapters`, {
      state: { subjectTitle: subject.name, subjectId: subject.id },
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto flex-grow">
        <h1 className="text-3xl font-bold text-center mb-8 mt-8 text-honeydew-good">
          Cursuri de parcurs{" "}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ml-10 ">
          {subjects.map((subject, index) => (
            <SubjectCard
              key={index}
              {...subject}
              onClick={() => handleSubjectClick(subject)}
            />
          ))}
        </div>
        <h2 className="text-3xl font-bold text-center mt-8 text-honeydew-good pt-12">
          Teoria pentru Matematica
        </h2>
        <Graph />
      </div>
    </div>
  );
}

export default SubjectsPage;
