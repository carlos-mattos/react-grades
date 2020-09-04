import React from 'react'
import Action from './Action';

export default function GradesControl({ grades, onDelete, onPersist }) {

  const tableGrade = [];
  let currentStudent = grades[0].student;
  let currentSubject = grades[0].subject;
  let currentGrades = [];
  let id = 1;

  grades.forEach((grade) => {
    if (grade.subject !== currentSubject) {
      tableGrade.push({
        id: id++,
        student: currentStudent,
        subject: currentSubject,
        grades: currentGrades
      });

      currentSubject = grade.subject;
      currentGrades = [];
    }

    if (grade.student !== currentStudent) {
      currentStudent = grade.student;
    }
    currentGrades.push(grade);
  })

  tableGrade.push({
    id: id++,
    student: currentStudent,
    subject: currentSubject,
    grades: currentGrades
  })

  const handleActionClick = (id, type) => {

    const grade = grades.find(grade => {
      return grade.id === id
    })

    if (type === 'delete') {
      onDelete(grade);
      return;
    }

    onPersist(grade)
  }


  return (
    <div>
      {tableGrade.map(({ id, grades }) => {

        const finalGrade = grades.reduce((acc, curr) => {
          return acc + curr.value
        }, 0)
        const gradeStyle = finalGrade >= 70 ? style.goodGrade : style.badGrade


        return (
          <table style={style.table} key={id} className='container striped'>
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Aluno</th>
                <th style={{ width: '20%' }}>Disciplina</th>
                <th style={{ width: '20%' }}>Avaliação</th>
                <th style={{ width: '20%' }}>Nota</th>
                <th style={{ width: '20%' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {grades.map(({ id, subject, student, type, value, isDeleted }) => {
                return (
                  <tr key={id}>
                    <td>{student}</td>
                    <td>{subject}</td>
                    <td>{type}</td>
                    <td>{isDeleted ? "-" : value}</td>
                    <td>
                      <Action type={isDeleted ? 'add' : 'edit'} id={id} onActionClick={handleActionClick} />
                      {!isDeleted && <Action type='delete' id={id} onActionClick={handleActionClick} />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td style={{ textAlign: 'right' }}><strong>Total</strong></td>
                <td><span style={gradeStyle}>{finalGrade}</span></td>
              </tr>
            </tfoot>
          </table>
        )
      })}
    </div>
  )
}


const style = {
  goodGrade: {
    fontWeight: 'bold',
    color: 'green'
  },

  badGrade: {
    fontWeight: 'bold',
    color: 'red'
  },

  table: {
    // margin: '20px',
    // padding: '10px'
  }
}