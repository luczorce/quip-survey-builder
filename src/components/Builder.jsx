import TextInput from './TextInput.jsx';

export default class Builder extends React.Component {
  constructor(props) {
    super();

    this.state = {
      questions: []
    };
  }

  addTextInput = () => {
    const question = {
      type: 'textInput',
      question: ''
    };

    let updatedQuestions = this.state.questions;
    updatedQuestions.push(question);

    this.setState({questions: updatedQuestions});
  }

  // this is used in a map function to iterate
  // and transform state question data into 
  // the appropriate type of form data to render
  buildSurveyElements = (element, index) => {
    if (element.type === 'textInput') {
      return <TextInput question={element.question} index={index} />;
    }
  }

  saveSurvey = () => {
    console.log('saving survey');
  }

  render() {
    let builderCanvas;

    if (this.state.questions.length) {
      let formElements = this.state.questions.map(this.buildSurveyElements);

      builderCanvas = <section>{ formElements }</section>
    } else {
      builderCanvas = <p>add questions...</p>
    }

    return <div>
      <nav>
        <strong>add to form:</strong>
        <button type="button" onClick={this.addTextInput}>short text</button>

        <button type="button" onClick={this.saveSurvey} disabled>save survey</button>
      </nav>

      { builderCanvas }
    </div>;
  }
}
