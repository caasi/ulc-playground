import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as LambdaActions from '../../actions/lambda';

import Source from '../../components/Source';
import AST from '../../components/AST';

function mapStateToProps(state) {
  return {
    lambda: state.lambda
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      lambda: bindActionCreators(LambdaActions, dispatch)
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  (props) => {
    let { lambda, actions } = props;
    return (
      <div className="index">
        <Source
          className="lambda"
          value={lambda.source}
          onChange={e => {
            actions.lambda.source(e.target.value);
          }}
        />
        <AST
          tree={lambda.ast}
        />
      </div>
    );
  }
);
