import { qatypes, optionTypes } from './enums.js';

const endpoint = '%%api_route%%';
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

export function deleteQuestion(id, type) {
  const path = `${endpoint}/questions/${type}/${id}`;
  const options = {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  return combinedFetch(path, options);
}

export function deleteSurvey(id) {
  const path = `${endpoint}/surveys/${id}`;  
  const options = {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  return combinedFetch(path, options);
}

export function getSavedSurvey(id) {
  const path = `${endpoint}/surveys/${id}`;
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  return combinedFetch(path, options);
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

export function getSurveyResults(surveyId) {
  const path = `${endpoint}/surveys/${surveyId}/results`;  
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
    body: JSON.stringify(buildQuestionBody(question, index)),
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

export function updateSurveyQuestion(question, index) {
  const path = `${endpoint}/questions/${question.id}`;
  const options = {
    method: 'PUT',
    body: JSON.stringify(buildQuestionBody(question, index)),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  return combinedFetch(path, options);
}

//////

function buildNewAnswerBody(question, quipDocumentId) {
  let answer = {
    answer_type: question.question_type,
    quip_id: quipDocumentId,
    answer: ''
  };
  
  if (question.question_type === qatypes.ranked) {
    answer.answer = question.options.join('~~~');
  }
 
  return answer;
}

function buildQuestionBody(question, index) {
  let payload;

  if (question.type === qatypes.header) {
    payload = {
      question_type: question.type,
      value: question.value,
      order: index,
    };
  } else {
    payload = {
      question_type: question.type,
      order: index,
      question: question.question,
      question_helper: question.helper
    };
  }

  if (optionTypes.includes(question.type)) {
    payload.options = question.options.join('~~~');
    payload.option_helpers = question.optionHelpers.join('~~~');
  }

  if (question.type === qatypes.numberInput) {
    payload.min = question.min || null;
    payload.max = question.max || null;
  }

  return payload;
}

function buildUpdatedAnswerBody(type, value) {
  if ([qatypes.checkbox, qatypes.ranked].includes(type) && typeof value !== 'string') {
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
      return (resp.status === 204) ? {} : resp.json();
    }).then(responseBody => {
      response.data = responseBody;
      resolve(response);
    });
  });
}