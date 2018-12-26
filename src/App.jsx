import Styles from "./App.less";
import Builder from './components/Builder.jsx';

export default class App extends React.Component {
  constructor(props) {
    super();

    this.state = {
      // can be either building or loading
      currentUse: null
    };
  }

  startBuildingSurvey = () => {
    this.setState({currentUse: 'building'});
  }

  loadSurveyOptions = () => {
    this.setState({currentUse: 'loading'});
  }

  render() {
    let canvas;

    if (this.state.currentUse === 'building') {
      canvas = <Builder />;
    } else if (this.state.currentUse === 'loading') {
      canvas = <div>retrieve a bear</div>;
    }

    return <div>
      <nav>
        <button type="button" onClick={this.startBuildingSurvey}>build a survey</button>
        <button type="button" onClick={this.loadSurveyOptions} disabled>load a survey</button>
      </nav>

      <section>
        { canvas }    
      </section>
    </div>;
  }
}
