
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

import React, { Component } from 'react';
import _ from 'lodash';
import sundial from 'sundial';

import IncrementalInput from '../../components/incrementalinput';
import CustomizedTrendsChart from './customizedtrendschart';

import personUtils from '../../core/personutils';

export const DEFAULT_SETTINGS = {
  bgTarget: {
    low: 70,
    high: 180,
  },
  units: {
    bg: 'mg/dL',
  },
};

const VALUES_MIN_MAX = {
  'mg/dL': {
    low: {
      min: 60,
      max: 180,
    },
    high: {
      min: 80,
      max: 250,
    },
  },
  'mmol': {
    // to be defined at a later date, once unit switching is implemented
  },
};

export default class PatientSettings extends Component {
  static propTypes = {
    editingAllowed: React.PropTypes.bool.isRequired,
    patient: React.PropTypes.object,
    onUpdatePatientSettings: React.PropTypes.func.isRequired,
    trackMetric: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onIncrementChange = this.onIncrementChange.bind(this);
    this.resetRange = this.resetRange.bind(this);
    this.state = {
      tracked: {
        low: false,
        high: false,
      },
      error: {
        low: false,
        high: false,
      },
    };
  }

  render() {
    const self = this;
    const patient = self.props.patient;
    let settings = {};
  
    if (!patient) {
      return (<div></div>);
    }

    if (!patient.settings) {
      settings = DEFAULT_SETTINGS;
    }
    else {
      settings = _.defaultsDeep({}, patient.settings, DEFAULT_SETTINGS);
    }

    const lowNode = (self.props.editingAllowed) ? self.renderIncrementalInput('low', settings) : self.renderValueNode('low', settings);
    const highNode = (self.props.editingAllowed) ? self.renderIncrementalInput('high', settings) : self.renderValueNode('high', settings);
    const resetNode = (self.props.editingAllowed) ? (<a href="#" className="PatientSettings-reset" onClick={self.resetRange}>Reset to default</a>) : null;

    const errorNode = (self.state.error.low || self.state.error.high) ? self.renderErrorNode() : null;

    return (
      <div className="PatientSettings">
        <div className="PatientPage-sectionTitle">My target range <span className="PatientPage-sectionTitle--lowercase">is</span></div>
        <div className="PatientInfo-content">
          <div className="PatientInfo-head">
            <div className="PatientSettings-blocks">
              <div className="PatientInfo-blockRow">
                Above
                {lowNode}
                and below
                {highNode}
                {resetNode}
              </div>
            </div>
            {errorNode}
            <div className="PatientSettings-blocks">
              <CustomizedTrendsChart
                max={settings.bgTarget.high}
                min={settings.bgTarget.low}
                />
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderValueNode(bound, settings) {
    return (<span className="PatientSettings-bgValue">{settings.bgTarget[bound]} {settings.units.bg}</span>);
  }

  renderIncrementalInput(bound, settings) {
    return (<IncrementalInput
      name={bound}
      error={this.state.error[bound]}
      value={settings.bgTarget[bound]}
      unit={settings.units.bg}
      minValue={VALUES_MIN_MAX[settings.units.bg][bound].min}
      maxValue={VALUES_MIN_MAX[settings.units.bg][bound].max}
      step={5}
      onChange={this.onIncrementChange}
      />);
  }

  renderErrorNode() {
    if (this.state.error.low) {
      return (<p className="PatientSettings-error-message">Upper target must be greater than lower target.</p>);
    }
    else if (this.state.error.high) {
      return (<p className="PatientSettings-error-message">Lower target must be less than upper target.</p>);
    }
  }

  resetRange(e) {
    e.preventDefault();

    this.setState({
      error: {
        low: false,
        high: false,
      },
    });

    this.props.onUpdatePatientSettings(this.props.patient.userid, DEFAULT_SETTINGS);
  }

  onIncrementChange(inputName, newValue, newUnit) {
    let lowError = false;
    let highError = false;

    const newSettings = _.defaultsDeep({}, {
      bgTarget: {
        [inputName]: newValue,
      },
      units: {
        bg: newUnit,
      }
    }, this.props.patient.settings, DEFAULT_SETTINGS);

    if (!this.validateBounds(newSettings.bgTarget)) {
      switch(inputName) {
        case 'low':
          highError = true;
          break;
        case 'high':
          lowError = true;
          break;
      }

      this.setState({
        error: {
          low: lowError,
          high: highError,
        },
      });

      return;
    }

    this.setState({
      error: {
        low: false,
        high: false,
      },
    });

    if (!this.state.tracked[inputName]) {
      this.props.trackMetric(inputName + ' target changed');

      this.setState({
        tracked: {
          [inputName]: true,
        },
      });
    }

    this.props.onUpdatePatientSettings(this.props.patient.userid, newSettings);
  }

  validateBounds(bounds) {
    return bounds.low < bounds.high;
  }

}