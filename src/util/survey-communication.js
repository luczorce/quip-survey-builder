import { qatypes } from './enums.js';

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
  if (question.question_type === qatypes.textInput) {
    return {
      type: qatypes.textInput,
      quip_id: quipDocumentId,
      answer: ''
    };
  } else if (question.question_type === qatypes.textarea) {
    return {
      type: qatypes.textarea,
      quip_id: quipDocumentId,
      answer: ''
    };
  }
}

function buildNewQuestionBody(question, index) {
  if (question.type === qatypes.textInput) {
    return {
      type: qatypes.textInput,
      order: index,
      question: question.question
    };
  } else if (question.type === qatypes.textarea) {
    return {
      type: qatypes.textarea,
      order: index,
      question: question.question
    };
  }
}

function buildUpdatedAnswerBody(type, value) {
  if (type === qatypes.textInput) {
    return {
      type: qatypes.textInput,
      answer: value
    };
  } else if (type === qatypes.textarea) {
    return {
      type: qatypes.textarea,
      answer: value
    };
  }
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