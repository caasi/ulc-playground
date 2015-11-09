import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as FoobarActions from '../../actions/foobar';

function mapStateToProps(state) {
  return { foobar: state.foobar };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(FoobarActions, dispatch) }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  (props) => {
    let { foobar, actions } = props;
    return (
      <div className="index" onClick={actions.foobar}>
        {foobar ? 'hi' : 'hello'}
      </div>
    );
  }
);
