import XLSX from 'xlsx';
import { qatypes, optionTypes } from './enums.js';

export function generateXLSX(surveyName, surveyData) {
  let rows = [];
  
  rows.push([''].concat(surveyData.questions.map(q => q.question)));
  rows.push([''].concat(surveyData.questions.map(q => q.question_type)));
  rows.push([''].concat(surveyData.questions.map(q => {
    return (optionTypes.includes(q.question_type)) ? q.options.join('\n') : '';
  })));

  rows = rows.concat(orderAnswers(surveyData));
  
  let workbook = XLSX.utils.book_new();
  rows = XLSX.utils.aoa_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, rows, 'survey results');
  XLSX.writeFile(workbook, `${surveyName}-${Date.now()}.xlsx`);
}

export function getAnswerKey(question) {
  let answerKey;

  switch (question.question_type) {
    case qatypes.textInput:
      answerKey = 'input_text_question_id';
      break;
    case qatypes.numberInput:
      answerKey = 'input_number_question_id';
      break;
    case qatypes.textarea:
      answerKey = 'textarea_question_id';
      break;
    case qatypes.select:
    case qatypes.radio:
    case qatypes.checkbox:
      answerKey = 'option_question_id';
      break;
    case qatypes.ranked:
      answerKey = 'ranked_question_id';
      break;
    default:
      answerKey = false;
  }

  return answerKey;
}

export function orderAnswers(surveyData) {
  let order = [];
  let orderedAnswers = [];

  surveyData.questions.forEach((q, index) => {
    order[index] = { key: getAnswerKey(q), id: q.id }
  });

  Object.keys(surveyData.answers).forEach(answerDocKey => {
    let answers = surveyData.answers[answerDocKey];
    let row = [];

    row.push(answerDocKey);
    order.forEach((o, index) => {
      answers.forEach(a => {
        if (o.key in a && a[o.key] === o.id) {
          let indexAfterDoc = index + 1;
          if (optionTypes.includes(a.answer_type)) {
            row[indexAfterDoc] = a.answer.join('\n');
          } else {
            row[indexAfterDoc] = a.answer;
          }
        }
      })
    });

    orderedAnswers.push(row);
  });

  return orderedAnswers;
}