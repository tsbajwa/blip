/**
 * Copyright (c) 2017, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../redux/actions';

import _ from 'lodash';

import config from '../../config';

import utils from '../../core/utils';

import LoginNav from '../../components/loginnav';
import LoginLogo from '../../components/loginlogo';

import { AUTH_CONFIG } from '../../authconfig';

export let HostedLogin = React.createClass({
  propTypes: {
    acknowledgeNotification: React.PropTypes.func.isRequired,
    confirmSignup: React.PropTypes.func.isRequired,
    fetchers: React.PropTypes.array.isRequired,
    isInvite: React.PropTypes.bool.isRequired,
    notification: React.PropTypes.object,
    onSubmit: React.PropTypes.func.isRequired,
    seedEmail: React.PropTypes.string,
    trackMetric: React.PropTypes.func.isRequired,
    working: React.PropTypes.bool.isRequired
  },

  getInitialState: function() {
    const formValues = {};
    const email = this.props.seedEmail;
    return {
      validationErrors: {},
      notification: null
    };
  },

  render: function() {
    const inviteIntro = this.renderInviteIntroduction();
    const nonce = Math.random().toString(36).substring(7);
    const authURL = `https://${AUTH_CONFIG.domain}/authorize?scope=${AUTH_CONFIG.scope}&audience=${AUTH_CONFIG.audience}&response_type=${AUTH_CONFIG.responseType}&client_id=${AUTH_CONFIG.clientId}&redirect_uri=${AUTH_CONFIG.loginRedirectUri}&nonce=${nonce}&initialScreen=login&signupEmail=${this.props.seedEmail}`; 
    
    return (
      <div className="login">
        <LoginNav
          page="login"
          hideLinks={Boolean(this.props.seedEmail)}
          trackMetric={this.props.trackMetric} />
        <LoginLogo />
        {inviteIntro}
        <div className="container-small-outer HostedLogin-form">
          <div className="container-small-inner HostedLogin-form-box">
            <div className="HostedLogin-simpleform">
            <a className="HostedLogin-link" href={authURL}>
              Login
            </a>
            </div>
          </div>
        </div>
      </div>
    );
  },

  renderInviteIntroduction: function() {
    if (!this.props.isInvite) {
      return null;
    }
    return (
      <div className='HostedLogin-inviteIntro'>
        <p>{'You\'ve been invited to Blip.'}</p><p>{'Log in to view the invitation.'}</p>
      </div>
    );
  },

  doFetching: function(nextProps) {
    if (!nextProps.fetchers) {
      return;
    }
    nextProps.fetchers.forEach(fetcher => {
      fetcher();
    });
  },

  /**
   * Before rendering for first time
   * begin fetching any required data
   */
  componentWillMount: function() {
    this.doFetching(this.props);
  }
});

/**
 * Expose "Smart" Component that is connect-ed to Redux
 */

let getFetchers = (dispatchProps, ownProps, other, api) => {
  if (other.signupKey) {
    console.log('got signup key: ',other.signupKey);
    return [
      dispatchProps.confirmSignup.bind(null, api, other.signupKey, other.signupEmail)
    ];
  }
  return [];
}

export function mapStateToProps(state) {
  return {
    notification: state.blip.working.loggingIn.notification || state.blip.working.confirmingSignup.notification,
    working: state.blip.working.loggingIn.inProgress,
  };
}

let mapDispatchToProps = dispatch => bindActionCreators({
  onSubmit: actions.async.login,
  acknowledgeNotification: actions.sync.acknowledgeNotification,
  confirmSignup: actions.async.confirmSignup
}, dispatch);

let mergeProps = (stateProps, dispatchProps, ownProps) => {
  let seedEmail = utils.getInviteEmail(ownProps.location) || utils.getSignupEmail(ownProps.location);
  let signupKey = utils.getSignupKey(ownProps.location);
  let isInvite = !_.isEmpty(utils.getInviteEmail(ownProps.location));
  let api = ownProps.routes[0].api;
  return Object.assign({}, stateProps, dispatchProps, {
    fetchers: getFetchers(dispatchProps, ownProps, { signupKey, signupEmail: seedEmail }, api),
    isInvite: isInvite,
    seedEmail: seedEmail,
    trackMetric: ownProps.routes[0].trackMetric,
    onSubmit: dispatchProps.onSubmit.bind(null, api)
  });
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(HostedLogin);
