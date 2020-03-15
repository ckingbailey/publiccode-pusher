import React, { Component } from "react";
import { connect } from "react-redux";
import { submit } from "redux-form";
import { APP_FORM } from "../contents/constants";

const mapStateToProps = state => ({
  form: state.form,
  fetchingRepo: state.repo.isFetching
})

const mapDispatchToProps = dispatch => {
  return {
    submit: name => dispatch(submit(name))
  };
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class foot extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let submitButton = <button
      type="button"
      className={ `editor_button ${this.props.fetchingRepo ? 'editor_button--quaternary' : 'editor_button--primary'}` }
      disabled={ this.props.fetchingRepo }
      onClick={ this.props.fetchingRepo ? null : () => this.props.submit(APP_FORM) }
    >{ this.props.fetchingRepo ? 'Pushing...' : 'Push to GitHub' }</button>

    return (
      <div className="content__foot">
        <div className="content__foot_item">
          <button
            className="editor_button  editor_button--custom"
            onClick={() => this.props.reset()}
          >
            Reset
          </button>
        </div>
        <div className="content__foot_item">
          { submitButton }
        </div>
      </div>
    );
  }
}

export default foot;
