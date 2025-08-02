import React, { useState, useEffect } from "react";
import chapterAPI from "../api/chapterAPI";
import SubjectAPI from "../api/subjectAPI";
import ClassForUserAPI from "../api/classForUserAPI";
import Swal from "sweetalert2";

const ChapterAdminPage = () => {
  const [chapters, setChapters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await chapterAPI.chapters();
        setChapters(response.data);
      } catch (error) {
        console.error("Error fetching chapters");
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await SubjectAPI.getAll();
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects");
      }
    };

    fetchChapters();
    fetchSubjects();
  }, []);

  const handleAddChapter = async () => {
    const response = await SubjectAPI.getAll();
    const subjects = response.data;
    const subjectOptions = subjects
      .map(
        (subject) => `<option value="${subject.id}">${subject.name}</option>`
      )
      .join("");

    const response1 = await ClassForUserAPI.getClasses();
    const classes = response1.data;
    const classOptions = classes
      .map(
        (classs) =>
          `<option value="${classs.id}">${classs.classNumber}</option>`
      )
      .join("");

    const { value: formValues } = await Swal.fire({
      title: "Adăugați un capitol nou",
      html: `
       <input id="swal-input1" class="swal2-input" placeholder="Nume">
       <select id="swal-select1" class="swal2-select">
           ${subjectOptions}
         </select>
         <select id="swal-select" class="swal2-select">
         ${classOptions}
       </select>
     `,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Da, adăugați-l!",
      cancelButtonText: "Anulare",
      preConfirm: () => {
        const name = Swal.getPopup().querySelector("#swal-input1").value;
        const subjectId = Swal.getPopup().querySelector("#swal-select1").value;
        const classId = Swal.getPopup().querySelector("#swal-select").value;
        return { name, subjectId, classId };
      },
    });

    if (formValues) {
      try {
        const response = await chapterAPI.addChapter(formValues);
        setChapters([...chapters, response.data]);
        Swal.fire("Adăugat!", "Capitolul a fost adăugat cu succes.", "success");
      } catch (error) {
        Swal.fire(
          "Eroare!",
          "A apărut o eroare la adăugarea capitolului.",
          "error"
        );
      }
    }
  };

  const handleUpdateChapter = async (id) => {
    const chapterToUpdate = chapters.find((chapter) => chapter.id === id);
    const response = await SubjectAPI.getAll();
    const subjects = response.data;
    const subjectOptions = subjects
      .map(
        (subject) =>
          `<option value="${subject.id}" ${
            subject.id === chapterToUpdate.subjectId ? "selected" : ""
          }>${subject.name}</option>`
      )
      .join("");

    const response1 = await ClassForUserAPI.getClasses();
    const classes = response1.data;
    const classOptions = classes
      .map(
        (classs) =>
          `<option value="${classs.id}" ${
            classs.id === chapterToUpdate.classId ? "selected" : ""
          }>${classs.classNumber}</option>`
      )
      .join("");

    const { value: formValues } = await Swal.fire({
      title: "Actualizați capitolul",
      html: `
     <input id="swal-input1" class="swal2-input" value="${chapterToUpdate.name}" placeholder="Nume">
       <select id="swal-select1" class="swal2-select">
           ${subjectOptions}
         </select>
         <select id="swal-select" class="swal2-select">
         ${classOptions}
       </select>
     `,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Da, actualizează-l!",
      cancelButtonText: "Anulare",
      preConfirm: () => {
        const name = Swal.getPopup().querySelector("#swal-input1").value;
        const subjectId = Swal.getPopup().querySelector("#swal-select1").value;
        const classId = Swal.getPopup().querySelector("#swal-select").value;
        return { name, subjectId, classId };
      },
    });

    if (formValues) {
      try {
        await chapterAPI.updateChapter(id, formValues);
        const updatedChapters = chapters.map((chapter) =>
          chapter.id === id ? { ...chapter, ...formValues } : chapter
        );
        setChapters(updatedChapters);
        Swal.fire(
          "Actualizat!",
          "Capitolul a fost actualizat cu succes.",
          "success"
        );
      } catch (error) {
        console.error("Failed to update chapter");
        Swal.fire(
          "Eroare!",
          "A apărut o eroare la actualizarea capitolului.",
          "error"
        );
      }
    }
  };

  const handleDeleteChapter = async (id) => {
    const result = await Swal.fire({
      title: "Sigur doriți să ștergeți acest capitol?",
      text: "Această acțiune este ireversibilă!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Da, ștergeți-l!",
      cancelButtonText: "Anulare",
    });

    if (result.isConfirmed) {
      try {
        await chapterAPI.deleteChapter(id);
        const updatedChapters = chapters.filter((chapter) => chapter.id !== id);
        setChapters(updatedChapters);
        Swal.fire("Șters!", "Capitolul a fost șters cu succes.", "success");
      } catch (error) {
        Swal.fire(
          "Eroare!",
          "A apărut o eroare la ștergerea capitolului.",
          "error"
        );
      }
    }
  };

  const subjectNames = {};
  subjects.forEach((subject) => {
    subject.chapters.forEach((chapter) => {
      subjectNames[chapter.id] = subject.name;
    });
  });

  return (
    <div style={{ width: "70%", margin: "auto" }} className="min-h-screen">
      <h2 className="font-bold text-2xl font-kodchasan mb-4">
        Lista Capitolelor
      </h2>
      <button
        onClick={handleAddChapter}
        className="btn btn-outline btn-info btn-sm"
      >
        Adăugați un capitol nou
      </button>
      <table
        style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Nume
            </th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Clasa + Profil
            </th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Materie
            </th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Acțiuni
            </th>
          </tr>
        </thead>
        <tbody>
          {chapters.map((chapter) => {
            const subjectName = subjectNames[chapter.id] || "N/A";
            return (
              <tr key={chapter.id}>
                <td style={{ padding: "8px" }}>{chapter.name}</td>
                <td style={{ padding: "8px" }}>
                  {chapter.classUser.classNumber +
                    " " +
                    chapter.classUser.profil}
                </td>
                <td style={{ padding: "8px" }}>{subjectName}</td>
                <td style={{ padding: "8px" }}>
                  <button
                    onClick={() => handleUpdateChapter(chapter.id)}
                    className="btn btn-outline btn-info btn-sm mr-4"
                  >
                    Modificați
                  </button>
                  <button
                    onClick={() => handleDeleteChapter(chapter.id)}
                    className="btn btn-outline btn-info btn-sm"
                  >
                    Ștergeți
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ChapterAdminPage;
