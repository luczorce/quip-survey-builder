import { qatypes, optionTypes } from './enums.js';

const endpoint = 'https://localhost:3000';
// const endpoint = 'https://eio-qi-surveys.herokuapp.com';
const API_KEY = '%%api_secret%%';

export function createAnswer(question, quipDocumentId) {
  let response;

  const path = `${endpoint}/questions/${question.id}/answers`;
  const options = {
    method: 'POST',
    body: JSON.stringify(buildNewAnswerBody(question, quipDocumentId)),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  return fetch(path, options).then(resp => {
    response = resp;
    return resp.json();
  }).then(responseBody => {
    response.data = responseBody;
    return response;
  });
}

export function getSavedSurveys() {
  const path = `${endpoint}/surveys`;  
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  return combinedFetch(path, options);
}

export function getSurveyQuestions(surveyId) {
  const path = `${endpoint}/surveys/${surveyId}/questions`;  
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  return combinedFetch(path, options);
}

export function saveSurveyName(name, surveyId) {
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

  return combinedFetch(path, options);
}

export function saveSurveyQuestion(surveyId, question, index) {
  const path = `${endpoint}/surveys/${surveyId}/questions`;
  const options = {
    method: 'POST',
    body: JSON.stringify(buildNewQuestionBody(question, index)),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  return combinedFetch(path, options);
}

export function updateAnswer(answerId, type, value) {
  const path = `${endpoint}/answers/${answerId}`;
  const options = {
    method: 'PUT',
    body: JSON.stringify(buildUpdatedAnswerBody(type, value)),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  return combinedFetch(path, options);
}

//////

function buildNewAnswerBody(question, quipDocumentId) {
  return {
    answer_type: question.question_type,
    quip_id: quipDocumentId,
    answer: ''
  };
}

function buildNewQuestionBody(question, index) {
  let payload = {
    question_type: question.type,
    order: index,
    question: question.question
  };

  if (optionTypes.includes(type)) {
    payload.options = question.options.join('~~~');
  }

  return payload;
}

function buildUpdatedAnswerBody(type, value) {
  if (type === type.qatypes.checkbox && typeof value !== 'string') {
    value = value.join('~~~');
  }

  return {
    answer_type: type,
    answer: value
  };
}

function combinedFetch(path, options) {
  let response;

  return new Promise((resolve, reject) => {
    fetch(path, options).then(resp => {
      response = resp;
      return resp.json();
    }).then(responseBody => {
      response.data = responseBody;
      resolve(response);
    });
  });
}