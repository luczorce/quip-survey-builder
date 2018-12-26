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

  saveSurvey = () => {
    console.log('saving survey');
  }

  render() {
    let inputs;

    if (this.state.questions.length) {
      // inputs = <p>here are all the questions</p>
      let sections = this.state.questions.map((question, index) => {
        if (question.type === 'textInput') {
          return <p key={index}>(text input {index + 1}) question: <input type="text" /></p>
        }
      });

      inputs = <div>{ sections }</div>
    } else {
      inputs = <p>add questions...</p>
    }

    return <div>
      <nav>
        <strong>add to form:</strong>
        <button type="button" onClick={this.addTextInput}>short text</button>

        <button type="button" onClick={this.saveSurvey} disabled>save survey</button>
      </nav>

      <section>
        { inputs }
      </section>
    </div>;
  }
}
