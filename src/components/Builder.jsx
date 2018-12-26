import TextInput from './TextInput.jsx';

export default class Builder extends React.Component {
  static propTypes = {
    questions: React.PropTypes.array,
    updateQuestions: React.PropTypes.func
  };

  addTextInput = () => {
    const question = {
      type: 'textInput',
      question: '',
      guid: Date.now()
    };

    let questions = this.props.questions;
    questions.push(question);

    this.props.updateQuestions(questions);
  }

  // this is used in a map function to iterate
  // and transform question data into 
  // the appropriate type of form data to render
  buildSurveyElements = (element, index) => {
    if (element.type === 'textInput') {
      return <TextInput question={element.question} index={index} guid={element.guid} updated={this.updateQuestion} deleted={this.deleteQuestion} />;
    }
  }

  deleteQuestion = (questionGuid) => {
    let questions = this.props.questions
    questions = questions.filter(q => q.guid !== questionGuid);

    this.props.updateQuestions(questions);
  }

  saveSurvey = () => {
    console.log('saving survey');
  }

  updateQuestion = (updatedValue) => {
    let index = updatedValue.index;
    let questions = this.props.questions;
    delete updatedValue.index;

    questions[index] = updatedValue;

    this.props.updateQuestions(questions);
  }

  render() {
    let builderCanvas;

    if (this.props.questions.length) {
      builderCanvas = <ol>{this.props.questions.map(this.buildSurveyElements)}</ol>
    } else {
      builderCanvas = <p>add questions...</p>
    }

    return <section>
      <nav>
        <strong>add to form:</strong>

        <button type="button" onClick={this.addTextInput}>short text</button>
        <button type="button" onClick={this.saveSurvey} disabled>save survey</button>
      </nav>

      { builderCanvas }
    </section>;
  }
}
