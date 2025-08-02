import React, { useState, useEffect } from "react";
import exercisesAPI from "../api/exercisesAPI";
import chapterAPI from "../api/chapterAPI";
import userTrackAPI from "../api/userTrackAPI";
import Swal from "sweetalert2";
import MathComponent from "../components/convertableScripts/MathConvertor";

const AdminPage = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    exercisesAPI
      .getExercices()
      .then((response) => {
        setExercises(response.data);
      })
      .catch((error) => {
        console.error("Error fetching exercises");
      });
  }, []);
  const handleAddExercise = async () => {
    const response = await chapterAPI.chapters();
    const chapters = response.data;
    const difficultyTypes = ["easy", "medium", "hard"];

    const chapterOptions = chapters
      .map(
        (chapter) => `<option value="${chapter.id}">${chapter.name}</option>`
      )
      .join("");

    const { value: formValues } = await Swal.fire({
      title: "Adăugați un exercițiu nou",
      html: `
         <input id="swal-input1" class="swal2-input" placeholder="Conținut">
         <input id="swal-input2" class="swal2-input" placeholder="Răspuns">
         <select id="swal-select1" class="swal2-select">
           ${chapterOptions}
         </select>
         <select id="swal-select2" class="swal2-select">
           ${Object.entries(difficultyTypes)
             .map(([key, value]) => `<option value="${key}">${value}</option>`)
             .join("")}
         </select>
       `,
      showCancelButton: true,
      confirmButtonColor: "#5d8aa8",
      cancelButtonColor: "#d33",
      confirmButtonText: "Da, adăugați-l!",
      cancelButtonText: "Anulare",
      preConfirm: () => {
        const content = Swal.getPopup().querySelector("#swal-input1").value;
        const answer = Swal.getPopup().querySelector("#swal-input2").value;
        const chapterId = Swal.getPopup().querySelector("#swal-select1").value;
        const type =
          difficultyTypes[Swal.getPopup().querySelector("#swal-select2").value];
        return { content, answer, type, chapterId };
      },
    });

    if (formValues) {
      try {
        const response = await exercisesAPI.addExercises(formValues);
        setExercises([...exercises, response.data]);
        Swal.fire(
          "Adăugat!",
          "Exercițiul a fost adăugat cu succes.",
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Eroare!",
          "A apărut o eroare la adăugarea exercițiului.",
          "error"
        );
      }
    }
  };

  const handleUpdateExercise = async (id) => {
    const exerciseToUpdate = exercises.find((exercise) => exercise.id === id);
    const response = await chapterAPI.chapters();
    const chapters = response.data;
    const difficultyTypes = ["easy", "medium", "hard"];

    const chapterOptions = chapters
      .map(
        (chapter) => `<option value="${chapter.id}">${chapter.name}</option>`
      )
      .join("");

    const { value: formValues } = await Swal.fire({
      title: "Actualizați exercițiul",
      html: `
         <input id="swal-input1" class="swal2-input" value="${
           exerciseToUpdate.content
         }" placeholder="Conținut">
         <input id="swal-input2" class="swal2-input" value="${
           exerciseToUpdate.answer
         }" placeholder="Răspuns">
          <select id="swal-select1" class="swal2-select">
           ${chapterOptions}
         </select>
         <select id="swal-select2" class="swal2-select">
           ${Object.entries(difficultyTypes)
             .map(([key, value]) => `<option value="${key}">${value}</option>`)
             .join("")}
         </select>
       `,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Da, actualizează-l!",
      cancelButtonText: "Anulare",
      preConfirm: () => {
        const content = Swal.getPopup().querySelector("#swal-input1").value;
        const answer = Swal.getPopup().querySelector("#swal-input2").value;
        const chapterId = Swal.getPopup().querySelector("#swal-select1").value;
        const type =
          difficultyTypes[Swal.getPopup().querySelector("#swal-select2").value];
        return { content, answer, type, chapterId };
      },
    });

    if (formValues) {
      try {
        await exercisesAPI.updateExercises(id, formValues);
        const updatedExercises = exercises.map((exercise) =>
          exercise.id === id ? { ...exercise, ...formValues } : exercise
        );
        setExercises(updatedExercises);
        Swal.fire(
          "Actualizat!",
          "Exercițiul a fost actualizat cu succes.",
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Eroare!",
          "A apărut o eroare la actualizarea exercițiului.",
          "error"
        );
      }
    }
  };

  const handleDeleteExercise = async (id) => {
    const result = await Swal.fire({
      title: "Sigur doriți să ștergeți acest exercițiu?",
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
        await exercisesAPI.deleteExercises(id);
        const updatedExercises = exercises.filter(
          (exercise) => exercise.id !== id
        );
        setExercises(updatedExercises);
        Swal.fire("Șters!", "Exercițiul a fost șters cu succes.", "success");
      } catch (error) {
        Swal.fire(
          "Eroare!",
          "A apărut o eroare la ștergerea exercițiului.",
          "error"
        );
      }
    }
  };

  const generateExercisesWithGPT = async () => {
    try {
      const response = await chapterAPI.chapters();
      const chapters = response.data;
      const difficultyTypes = ["easy", "medium", "hard"];
      const premiumTypes = ["false", "true"];

      const chapterOptions = chapters
        .map(
          (chapter) => `<option value="${chapter.id}">${chapter.name}</option>`
        )
        .join("");

      const { value: formValues } = await Swal.fire({
        title: "Adăugați exerciții noi",
        html: `
          <select id="swal-select1" class="swal2-select">
            ${chapterOptions}
          </select>
          <select id="swal-select2" class="swal2-select">
           ${Object.entries(difficultyTypes)
             .map(([key, value]) => `<option value="${key}">${value}</option>`)
             .join("")}
         </select>
          <input type="number" id="swal-input3" class="swal2-input" placeholder="Numărul de exerciții">
          <select id="swal-select3" class="swal2-select">
          ${Object.entries(premiumTypes)
            .map(([key, value]) => `<option value="${key}">${value}</option>`)
            .join("")}
          </select>
        `,
        showCancelButton: true,
        confirmButtonColor: "#5d8aa8",
        cancelButtonColor: "#d33",
        confirmButtonText: "Da, adăugați-le!",
        cancelButtonText: "Anulare",
        preConfirm: () => {
          const chapterId =
            Swal.getPopup().querySelector("#swal-select1").value;
          const type =
            difficultyTypes[
              Swal.getPopup().querySelector("#swal-select2").value
            ];
          const number = parseInt(
            Swal.getPopup().querySelector("#swal-input3").value
          );
          const premium =
            premiumTypes[Swal.getPopup().querySelector("#swal-select3").value];
          return { chapterId, type, number, premium };
        },
      });

      if (formValues) {
        const response = await userTrackAPI.generateExercisesWithGPT(
          formValues
        );
        setExercises([...exercises, ...response.data]);

        Swal.fire({
          title: "Exerciții adăugate",
          html: response.data,
          icon: "success",
        });
      }
    } catch (error) {
      Swal.fire(
        "Error!",
        "An error occurred while adding the exercises.",
        "error"
      );
    }
  };

  return (
    <div style={{ width: "70%", margin: "auto" }} className="min-h-screen">
      <h2 className="font-bold text-2xl font-kodchasan mb-4">
        Lista Exercitiilor
      </h2>
      <button
        onClick={handleAddExercise}
        className="btn btn-outline btn-info btn-sm mr-4"
      >
        Adăugați un exercițiu nou
      </button>
      <button
        onClick={generateExercisesWithGPT}
        className="btn btn-outline btn-info btn-sm mr-4"
      >
        Generati exercitii cu GPT
      </button>
      <table
        style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Conținut
            </th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Răspuns
            </th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Tip
            </th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Acțiuni
            </th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((exercise) => (
            <tr key={exercise.id}>
              <td style={{ padding: "8px" }}>
                <MathComponent latex={exercise.content} />
              </td>
              <td style={{ padding: "8px" }}>{exercise.answer}</td>
              <td style={{ padding: "8px" }}>{exercise.type}</td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => handleUpdateExercise(exercise.id)}
                  className="btn btn-outline btn-info btn-sm mb-2"
                >
                  Modificați
                </button>
                <button
                  onClick={() => handleDeleteExercise(exercise.id)}
                  className="btn btn-outline btn-info btn-sm "
                >
                  Ștergeți
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
