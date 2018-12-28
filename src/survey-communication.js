const endpoint = 'https://localhost:3000';
// const endpoint = 'https://eio-qi-surveys.herokuapp.com';
const API_KEY = '%%api_secret%%';

export function saveSurveyQuestions(surveyId, question, index) {
  const path = `${endpoint}/surveys/${surveyId}/questions`;
  const options = {
    method: 'POST',
    body: JSON.stringify(buildNewQuestionBody(question, index)),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  return fetch(path, options);
}

export function getSavedSurveys() {
  const path = `${endpoint}/surveys`;  
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  return fetch(path, options);
}

export function saveSurveyName(name) {
  const path = `${endpoint}/surveys`;  
  const options = {
    method: 'POST',
    body: JSON.stringify({name: name}),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  return fetch(path, options);
}

//////

function buildNewQuestionBody(question, index) {
  if (question.type === 'textInput') {
    return {
      type: 'text_input',
      order: index,
      question: question.question
    }
  }
}
