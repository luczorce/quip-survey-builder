import TextInputAnswer from './TextInputAnswer.jsx';
import TextareaAnswer from './TextareaAnswer.jsx';
import { qatypes } from '../util/enums.js';

export default class SurveyForm extends React.Component {
  static propTypes = {
    questions: React.PropTypes.array,
    answers: React.PropTypes.array,
    updateAnswer: React.PropTypes.func
  };

  buildForm = () => {
    if (!this.props.questions.length) return <p>no questions</p>;

    return this.props.questions.map(q => {
      if (q.question_type === qatypes.textInput) {
        let answer = this.props.answers.find(a => a.input_text_question_id === q.id);

        return <TextInputAnswer 
                question={q.question}
                answer={answer}
                update={this.props.updateAnswer} />;
      } else if (q.question_type === qatypes.textarea) {
        let answer = this.props.answers.find(a => a.textarea_question_id === q.id);

        return <TextareaAnswer 
                question={q.question}
                answer={answer}
                update={this.props.updateAnswer} />;
      }
    });
  }

  render() {
    const fields = this.buildForm();
    return <section>
      {fields}
    </section>;
  }
}
