import React, { useEffect, useState } from "react";
import classForUserAPI from "../../src/api/classForUserAPI";
import Swal from "sweetalert2";

function ClassForUser() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await classForUserAPI.getClasses();
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes");
      }
    };

    fetchClasses();
  }, []);

  const handleAddClass = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Adăugați o clasa noua",
      html: `
          <input id="swal-input" class="swal2-input" type="number" placeholder="Number">
          <input id="swal-input1" class="swal2-input" placeholder="Profile">
        `,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Da, adăugați-l!",
      cancelButtonText: "Anulare",
      preConfirm: () => {
        const number = Swal.getPopup().querySelector("#swal-input").value;
        const profil = Swal.getPopup().querySelector("#swal-input1").value;
        return { number, profil };
      },
    });

    if (formValues) {
      try {
        await classForUserAPI.addClass(formValues);
        const response1 = await classForUserAPI.getClasses();
        setClasses(response1.data);
        Swal.fire("Adăugat!", "Clasa a fost adăugat cu succes.", "success");
      } catch (error) {
        Swal.fire("Eroare!", "A apărut o eroare la adăugarea clasei.", "error");
      }
    }
  };

  const handleUpdate = async (id) => {
    const classToUpdate = classes.find((classs) => classs.id === id);
    const { value: formValues } = await Swal.fire({
      title: "Actualizați capitolul",
      html: `
       <input id="swal-input" class="swal2-input" type="number" value="${classToUpdate.classNumber}" placeholder="Number">
       <input id="swal-input1" class="swal2-input" value="${classToUpdate.profil}" placeholder="Profile">
       `,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Da, actualizează-l!",
      cancelButtonText: "Anulare",
      preConfirm: () => {
        const number = Swal.getPopup().querySelector("#swal-input").value;
        const profil = Swal.getPopup().querySelector("#swal-input1").value;
        return { number, profil };
      },
    });

    if (formValues) {
      try {
        await classForUserAPI.updateClass(id, formValues);
        const response = await classForUserAPI.getClasses();
        setClasses(response.data);
        Swal.fire(
          "Actualizat!",
          "Clasa a fost actualizat cu succes.",
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Eroare!",
          "A apărut o eroare la actualizarea clasei.",
          "error"
        );
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Sigur doriți să ștergeți acest clasa?",
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
        await classForUserAPI.deleteClass(id);
        const updatedClasses = classes.filter((classs) => classs.id !== id);
        setClasses(updatedClasses);
        Swal.fire("Șters!", "Clasa a fost șters cu succes.", "success");
      } catch (error) {
        Swal.fire("Eroare!", "A apărut o eroare la ștergerea clasei.", "error");
      }
    }
  };

  return (
    <div style={{ width: "70%", margin: "auto" }} className="min-h-screen">
      <h2 className="font-bold text-2xl font-kodchasan mb-4">Lista Claselor</h2>
      <button
        onClick={() => handleAddClass()}
        className="btn btn-outline btn-info btn-sm "
      >
        Adăugați o clasă nouă
      </button>
      <table
        style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Clasa + Profil
            </th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Acțiuni
            </th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classItem) => (
            <tr key={classItem.id}>
              <td style={{ padding: "8px" }}>
                {classItem.classNumber + " " + classItem.profil}
              </td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => handleUpdate(classItem.id)}
                  className="btn btn-outline btn-info btn-sm mr-4"
                >
                  Modificați
                </button>
                <button
                  onClick={() => handleDelete(classItem.id)}
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
}

export default ClassForUser;
