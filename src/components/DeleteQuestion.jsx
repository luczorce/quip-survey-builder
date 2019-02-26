import Style from './Form.less';

export default class DeleteQuestion extends React.Component {
  static propTypes = {
    deleteFunc: React.PropTypes.func,
    isHeader: React.PropTypes.boolean
  }

  render() {
    const label = (this.props.isHeader) ? 'header' : 'question';
    
    return <span className={Style.icon}>
      <button type="button" onClick={this.props.deleteFunc} className={Style.sectionDeleter}>delete {label}</button>

      <span title="delete this question" aria-hidden="true" onClick={this.props.deleteFunc}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d0021b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="arcs"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
      </span>
    </span>
  }
}