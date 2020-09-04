import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'
import * as api from '../api/apiService.js'

Modal.setAppElement("#root");

export default function ModalGrade({ onSave, onClose, selectedGrade }) {

  const { id, student, subject, type, value } = selectedGrade
  const [gradeValue, setGradeValue] = useState(value)
  const [gradeValidation, setGradeValidation] = useState({})
  const [errorMessage, setErrorMessage] = useState('')


  useEffect(() => {
    const handleValidation = async () => {
      const validation = await api.getValidationFromGradeType(type)
      setGradeValidation(validation)
    }
    handleValidation();
  }, [type])


  useEffect(() => {
    const { minValue, maxValue } = gradeValidation;
    if (gradeValue < minValue || gradeValue > maxValue) {
      setErrorMessage(`O valor da nota deve ser entre ${minValue} e ${maxValue} (inclusive)`)
      return;
    }
    setErrorMessage('');
  }, [gradeValue, gradeValidation])


  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  })


  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose(null)
    }
  }


  const handleFormSubmit = (event) => {
    console.log(event)
    event.preventDefault()
    const formData = {
      id,
      newValue: gradeValue,
    }
    onSave(formData);
  }

  const handleGradeChange = (event) => {
    setGradeValue(+event.target.value)
  }

  const handleModalClose = (event) => {
    onClose(null);
  }

  return (
    <div>
      <Modal isOpen={true}>
        <div style={styles.flexRow}>
          <span style={styles.title}>Configuração Notas</span>
          <button className='waves-effect waves-lights btn red dark-4' onClick={handleModalClose} >X</button>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className='input-field'>
            <input type="text" id='inputName' value={student} readOnly />
            <label htmlFor="inputName" className='active'>Nome do Aluno:</label>
          </div>
          <div className='input-field'>
            <input type="text" id='inputSubject' value={subject} readOnly />
            <label htmlFor="inputSubject" className='active'>Disciplina:</label>
          </div>
          <div className='input-field'>
            <input type="text" id='inputType' value={type} readOnly />
            <label htmlFor="inputType" className='active'>Tipo de Avaliação:</label>
          </div>
          <div className='input-field'>
            <input id='inputGrade'
              type="Number"
              min={gradeValidation.minValue}
              max={gradeValidation.maxValue}
              step='1'
              autoFocus
              value={gradeValue}
              onChange={handleGradeChange} />
            <label htmlFor="inputGrade" className='active'>Nota:</label>
          </div>
          <div style={styles.flexRow}>
            <button
              className='waves-effect waves-light btn'
              disabled={errorMessage.trim() !== ''}>
              Salvar
            </button>
            <span style={styles.errorMessage}>{errorMessage}</span>
          </div>
        </form>
      </Modal>
    </div>
  )
}

const styles = {
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItens: 'center',
    justifyContent: 'space-between',
    marginBottom: '40px'
  },

  title: {
    fontSize: '1.3rem',
    fontWeight: 'bold'
  },

  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  }

}