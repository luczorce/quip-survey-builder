const endpoint = 'https://localhost:3000';
// const endpoint = 'https://eio-qi-surveys.herokuapp.com';
const API_KEY = '%%api_secret%%';

export function getSavedSurveys() {
  let response;
  const path = `${endpoint}/surveys`;  
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  return fetch(path, options).then(resp => {
    response = resp;
    return resp.json()
  }).then(responseBody => {
    response.data = responseBody;
    return response;
  });
}

export function saveSurveyName(name, surveyId) {
  let response;
  let path = `${endpoint}/surveys`;  
  let method = 'POST';

  if (surveyId !== null) {
    path += `/${surveyId}`;
    method = 'PUT';
  }

  const options = {
    method: method,
    body: JSON.stringify({name: name}),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  return fetch(path, options).then(resp => {
    response = resp;
    return resp.json()
  }).then(responseBody => {
    response.data = responseBody;
    return response;
  });
}

export function saveSurveyQuestions(surveyId, question, index) {
  let response;
  const path = `${endpoint}/surveys/${surveyId}/questions`;
  const options = {
    method: 'POST',
    body: JSON.stringify(buildNewQuestionBody(question, index)),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  return fetch(path, options).then(resp => {
    response = resp;
    return resp.json()
  }).then(responseBody => {
    response.data = responseBody;
    return response;
  });
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
