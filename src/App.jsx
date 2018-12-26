import Styles from "./App.less";
import Builder from './components/Builder.jsx';

export default class App extends React.Component {
  constructor(props) {
    super();

    this.state = {
      // can be either building or loading
      currentUse: props.record.get('purpose') || null
    };
  }

  getQuestions = () => {
    const { record } = this.props;
    let questions = record.get('questions');
    
    if (!questions) {
      questions = [];
    }

    return questions;
  }

  loadSurveyOptions = () => {
    const { record } = this.props;
    
    record.set('purpose', 'loading');
    this.setState({currentUse: 'loading'});
  }

  startBuildingSurvey = () => {
    const { record } = this.props;
    
    record.set('purpose', 'building');
    this.setState({currentUse: 'building'});
  }

  updateQuestions = (questions) => {
    const { record } = this.props;

    record.set('questions', questions);
  }

  getNavElement = () => {
    return <nav>
      <button type="button" onClick={this.startBuildingSurvey}>build a survey</button>
      <button type="button" onClick={this.loadSurveyOptions} disabled>load a survey</button>
    </nav>;
  }

  render() {
    let header, canvas;

    if (this.state.currentUse === 'building') {
      let questions = this.getQuestions();

      header = <h2 className="quip-text-h2">Currently Building Survey</h2>;
      canvas = <Builder questions={questions} updateQuestions={this.updateQuestions}/>;
    } else if (this.state.currentUse === 'loading') {
      canvas = <div>retrieve a bear</div>;
    } else {
      header = this.getNavElement();
    }

    return <div>
      { header }

      <section>
        { canvas }    
      </section>
    </div>;
  }
}
