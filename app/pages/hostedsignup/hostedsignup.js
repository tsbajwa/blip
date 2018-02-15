/**
 * Copyright (c) 2014, Tidepool Project
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

import * as actions from '../../redux/actions';

import _ from 'lodash';

import LoginNav from '../../components/loginnav';
import LoginLogo from '../../components/loginlogo';

import { AUTH_CONFIG } from '../../authconfig';

import check from './images/check.svg';

export let HostedSignup = React.createClass({
  propTypes: {
    acknowledgeNotification: React.PropTypes.func.isRequired,
    api: React.PropTypes.object.isRequired,
    configuredInviteKey: React.PropTypes.string.isRequired,
    inviteEmail: React.PropTypes.string,
    inviteKey: React.PropTypes.string,
    roles: React.PropTypes.array,
    notification: React.PropTypes.object,
    onSubmit: React.PropTypes.func.isRequired,
    trackMetric: React.PropTypes.func.isRequired,
    working: React.PropTypes.bool.isRequired
  },

  componentWillMount: function() {
    this.setState({loading: false});
  },

  componentWillReceiveProps: function(nextProps){
    if(nextProps.location.pathname === '/signup'){
      this.setState({madeSelection:false});
    }
  },

  getInitialState: function() {
    return {
      loading: true,
      validationErrors: {},
      notification: null,
      selected: null,
      madeSelection: false
    };
  },

  handleSelectionClick: function(option){
    this.setState({selected: option})
  },

  render: function() {
    let inviteIntro = this.renderInviteIntroduction();
    let typeSelection = this.renderTypeSelection();
    if (!this.state.loading) {
      return (
        <div className="signup">
          <LoginNav
            page="signup"
            hideLinks={Boolean(this.props.inviteEmail)}
            trackMetric={this.props.trackMetric} />
          <LoginLogo />
          {inviteIntro}
          {typeSelection}
        </div>
      );
    }
  },

  renderInviteIntroduction: function() {
    if (!this.props.inviteEmail) {
      return null;
    }

    return (
      <div className='signup-inviteIntro'>
        <p>{'You\'ve been invited to Blip.'}</p><p>{'Sign up to view the invitation.'}</p>
      </div>
    );
  },

  renderTypeSelection: function() {
    if(this.state.madeSelection){
      return null;
    }
    let personalClass = 'signup-selection' + (this.state.selected === 'personal' ? ' selected' : '');
    let clinicanClass = 'signup-selection' + (this.state.selected === 'clinician' ? ' selected' : '');
    return (
      <div className="signup-container container-small-outer">
        <div className="signup-title">Sign Up for Tidepool</div>
        <div className="signup-subtitle">Which kind of account do you need?</div>
        <div className={personalClass} onClick={_.partial(this.handleSelectionClick, 'personal')}>
          <div className="signup-selectionHeader">
            <div className="signup-selectionTitle">Personal Account</div>
            <div className="signup-selectionCheck">
              <img src={check} />
            </div>
          </div>
          <div className="signup-selectionDescription">You want to manage
            your diabetes data. You are caring for or supporting someone
            with diabetes.
          </div>
        </div>
        <div className={clinicanClass} onClick={_.partial(this.handleSelectionClick, 'clinician')}>
          <div className="signup-selectionHeader">
            <div className="signup-selectionTitle">Clinician Account</div>
            <div className="signup-selectionCheck">
              <img src={check} />
            </div>
          </div>
          <div className="signup-selectionDescription">You are a doctor, a
            clinic or other healthcare provider that wants to use Tidepool to
            help people in your care.
          </div>
        </div>
        <div className="signup-continue">
          <button className="btn btn-primary" disabled={!this.state.selected} onClick={this.handleContinueClick}>Continue</button>
        </div>
      </div>
    );
  },

  handleContinueClick: function(e){
    this.setState({madeSelection:true});
    function nonce() {
      return  Math.random().toString(36).substring(7);
    }
    window.location = `https://${AUTH_CONFIG.domain}/authorize?scope=${AUTH_CONFIG.scope}&audience=${AUTH_CONFIG.audience}&response_type=${AUTH_CONFIG.responseType}&client_id=${AUTH_CONFIG.clientId}&redirect_uri=${AUTH_CONFIG.signupRedirectUri}&nonce=${nonce()}&initialScreen=signUp&role=${this.state.selected}`;
  },
});

export default HostedSignup;
