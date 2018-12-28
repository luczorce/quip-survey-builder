import TextInputAnswer from './TextInputAnswer.jsx';
import { qatypes } from '../util/enums.js';

export default class SurveyForm extends React.Component {
  static propTypes = {
    questions: React.PropTypes.array,
    answers: React.PropTypes.array,
    updateAnswer: React.PropTypes.func
  };

  buildForm = () => {
    return this.props.questions.map(q => {
      // TODO if (question.type === qatypes.textInput)
      let answer = this.props.answers.find(a => a.input_text_question_id === q.id);

      return <TextInputAnswer 
              question={q.question}
              answer={answer}
              update={this.props.updateAnswer} />;
    });
  }

  render() {
    const fields = this.buildForm();
    return <section>
      {fields}
    </section>;
  }
}
