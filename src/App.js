import React, { useState, useEffect } from 'react';
import * as api from './api/apiService.js'
import PreLoader from './components/PreLoader.js';
import GradesControl from './components/GradesControl.js';
import ModalGrade from './components/ModalGrade.js'

export default function App() {

  const [allGrades, setAllGrades] = useState([]);
  const [selectGrade, setSelectGrade] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    api.getAllGrades().then((grades) => {
      setTimeout(() => {
        setAllGrades(grades)
      }, 2000);
    })
  }, [])

  const handleDelete = async (gradeToDelete) => {
    const isDeleted = await api.deleteGrades(gradeToDelete)
    if (isDeleted) {
      const deleteGradeIndex =
        allGrades.findIndex(grade => {
          return grade.id === gradeToDelete.id
        })
      const newGrades = Object.assign([], allGrades);
      newGrades[deleteGradeIndex].isDeleted = true;
      newGrades[deleteGradeIndex].value = 0;

      setAllGrades(newGrades);
    }
  }

  const handlePersist = (grade) => {
    setIsModalOpen(true);
    setSelectGrade(grade);
  }

  const handlePersistData = async (formData) => {
    const { id, newValue } = formData;
    const newGrades = Object.assign([], allGrades);
    const gradeToPersist = newGrades.find(grade => {
      return grade.id === id
    })
    gradeToPersist.value = newValue;

    if (gradeToPersist.isDeleted) {
      gradeToPersist.isDeleted = false;
      await api.insertGrades(gradeToPersist);
    }
    else {
      await api.updateGrades(gradeToPersist);
    }

    setIsModalOpen(false);
  }

  const handleClose = () => {
    setIsModalOpen(false);
  }

  return (
    <div>
      <h2 className="center">Grades Control</h2>
      {allGrades.length === 0 && <PreLoader />}
      {allGrades.length > 0 && <GradesControl grades={allGrades}
        onDelete={handleDelete}
        onPersist={handlePersist} />}
      {isModalOpen && <ModalGrade
        onSave={handlePersistData}
        onClose={handleClose}
        selectedGrade={selectGrade} />}
    </div>
  )
}
