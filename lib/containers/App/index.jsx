import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as LambdaActions from '../../actions/lambda';

import Source from '../../components/Source';
import AST from '../../components/AST';

import styles from './index.css';

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
    let { className, children, lambda, actions } = props;
    return (
      <div className={`${styles.className} ${className}`}>
        <Source
          className="lambda"
          value={lambda.source}
          onChange={e => {
            actions.lambda.source(e.target.value);
          }}
        />
        <div
          className="panel"
        >
          <button
            className="evaluate"
            onClick={e => {
              actions.lambda.reduce();
            }}
          >
            evaluate
          </button>
        </div>
        <AST
          className="input"
          tree={lambda.ast}
        />
        <AST
          className="output"
          tree={lambda.reduced}
        />
      </div>
    );
  }
);
