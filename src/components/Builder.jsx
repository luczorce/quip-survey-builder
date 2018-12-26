import Style from "../App.less";
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
      return <TextInput question={element.question} guid={element.guid} updated={this.updateQuestion} deleted={this.deleteQuestion} />;
    }
  }

  deleteQuestion = (questionGuid) => {
    let questions = this.props.questions
    questions = questions.filter(q => q.guid !== questionGuid);

    this.props.updateQuestions(questions);
  }

  updateQuestion = (updatedValue) => {
    let questions = this.props.questions;
    let index = questions.findIndex(q => q.guid === updatedValue.guid);

    questions[index] = updatedValue;

    this.props.updateQuestions(questions);
  }

  render() {
    let builderCanvas;

    if (this.props.questions.length) {
      builderCanvas = <ol>
        {this.props.questions.map(this.buildSurveyElements)}
      </ol>;
    } else {
      builderCanvas = <p>add questions...</p>;
    }

    return <section>
      <nav className={Style.flexirow}>
        <strong>add to form:</strong>

        <button type="button" onClick={this.addTextInput}>short text</button>
      </nav>

      { builderCanvas }
    </section>;
  }
}
