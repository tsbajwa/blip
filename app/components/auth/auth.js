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
import { browserHistory } from 'react-router';
import AuthService from '../../core/authservice';

export default class Auth extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
  }
  componentDidMount () {
    this.auth = new AuthService();
    this.auth.handleAuthentication(this.props.route.api);
    browserHistory.push('/patients?justLoggedIn=true');
  }
  render () {
    return null;
  }
}

