import Styles from "./App.less";
import Builder from './components/Builder.jsx';

export default class App extends React.Component {
  constructor(props) {
    super();

    this.state = {
      // can be either building or loading
      currentUse: props.record.get('purpose') || null,
      questions: props.record.get('questions') || []
    };
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
    this.setState({questions: questions});
  }

  render() {
    let header, canvas;

    if (this.state.currentUse === 'building') {
      header = <header>
        <h2 className="quip-text-h2">Building Survey</h2>
        
        <label>
          <span>survey name</span>
          <input type="text" value={this.state.surveyName} />
        </label>
      </header>;

      canvas = <Builder questions={this.state.questions} updateQuestions={this.updateQuestions}/>;
    } else if (this.state.currentUse === 'loading') {
      canvas = <div>retrieve a bear</div>;
    } else {
      header = <nav>
        <button type="button" onClick={this.startBuildingSurvey}>build a survey</button>
        <button type="button" onClick={this.loadSurveyOptions} disabled>load a survey</button>
      </nav>;
    }

    return <div>
      { header }
      { canvas }
    </div>;
  }
}
