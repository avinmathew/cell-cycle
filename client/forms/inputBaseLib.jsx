"use strict";
import React from 'react';
import R from 'ramda';
import classnames from 'classnames';


export function renderInputGroup(props, children) {
  let inputGroupTableStyle;
  let inputGroupClassName;
  let addonTableStyle = props.tableStyle && !props.headerStyle ? {"width": 0} : null;
  let inputGroupContentClassName = props.inputGroupContentClassName;

  if (props.headerStyle) {
    inputGroupTableStyle = {"width": "100%", "paddingRight": "30px"};
  } else if (props.tableStyle) {
    inputGroupTableStyle = {"width": "100%"};
  } else {
    inputGroupTableStyle = null;
  }

  let addonBefore = props.addonBefore ? (
    <span className="hidden-xs input-group-addon" key="addonBefore" style={addonTableStyle}>
        {props.addonBefore}
      </span>
  ) : null;

  let addonAfter = props.addonAfter ? (
    <span className="input-group-addon" key="addonAfter" style={addonTableStyle}>
        {props.addonAfter}
      </span>
  ) : null;

  let buttonBefore = props.buttonBefore ? (
    <span className="input-group-btn" style={addonTableStyle}>
        {props.buttonBefore}
      </span>
  ) : null;

  let buttonAfter = props.buttonAfter ? (
    <span className="input-group-btn" style={addonTableStyle}>
        {props.buttonAfter}
      </span>
  ) : null;

  switch (props.bsSize) {
    case 'small':
      inputGroupClassName = 'input-group-sm';
      break;
    case 'large':
      inputGroupClassName = 'input-group-lg';
      break;
    default:
  }

  return addonBefore || addonAfter || buttonBefore || buttonAfter
    ?
    (
      <div className={classnames(inputGroupClassName, "input-group")} key="input-group" style={inputGroupTableStyle}>
        {addonBefore}
        {buttonBefore}
        <div className="input-group-content">
          {children}
        </div>
        {addonAfter}
        {buttonAfter}
      </div>
    )
    :
    (
      <div className={classnames(inputGroupClassName, "input-group")} key="input-group" style={{"width": "100%"}}>
        <div className={classnames(inputGroupContentClassName, "input-group-content")}>
          {children}
        </div>
      </div>
    );
}

export function renderWrapper(props, children) {
  return props.wrapperClassName ? (
    <div className={props.wrapperClassName} key="wrapper">
      {children}
    </div>
  ) : children;
}


export function renderError(props) {
  if (!props.showError) {
    return null;
  }
  let id = R.isNil(props.id) ? `${props.name}-error` : `${props.id}-error`;
  let errorMessage = props.error.charAt(0) === props.error.charAt(0).toUpperCase()
    ? props.error
    : `${props.label} ${props.error}`;
  return <span className="help-block" id={id} key="error">{errorMessage}</span>;
}

export function renderHelp(props) {
  let id = R.isNil(props.id) ? `${props.name}-help` : `${props.id}-help`;
  const helpClass = props.helpPos === "right" ? "text-right" : "";
  if (props.showLabel && !R.isNil(props.help) && props.help.length > 0) {
    return (<span className="sr-only" id={id} key="help">
        {props.help}
      </span>);
  }
  return props.help && props.showHelp ? (
    <span className={classnames("help-block", helpClass)} id={id} key="help">
        {props.help}
      </span>
  ) : null;
}

export function renderLabel(props) {
  var showValidating = props.showValidating;
  var showError = props.showError && !showValidating;
  var showValid = props.touched
    && props.value
    && !showError
    && !showValidating;
  var classes = {
    "glyphiconSuperScript": showValid || showError || showValidating,
    "text-success": showValid,
    "text-info": showValidating,
    "text-danger": showError,
    "mdi-checkbox-marked-circle": showValid,
    "mdi-alert-circle": showError,
    "mdi-spin": showValidating,
    "mdi-refresh": showValidating
  };
  const _validation = R.defaultTo({}, props.validation);
  const required = R.path(['required'], _validation) === true
    || R.path(['required', '_value'], _validation) === true;
  let label = (
    <label htmlFor={props.id ? props.id : props.name + "-input"} key="label">
      <span>{props.label}</span>
      { required && props.showRequired && !showValid && !showError
        ? (<span><span>&nbsp;</span><span className="glyphiconSuperScript glyphicon-asterisk text-primary mandatory"
                             title="Mandatory"
                             data-toggle-tooltip="tooltip"
                             data-placement="top" /></span>)
        : (<span>&nbsp;</span>)
      }
      {props.hasFeedback ? <span className={classnames(classes)}/> : null}
      { props.showLabel && !R.isNil(props.help) && props.help.length > 0
        ? (<span><span>&nbsp;</span><span className="glyphiconSuperScript mdi-help-circle text-primary"
                                   title={props.help}
                                   data-toggle-tooltip="tooltip"
                                   data-placement="top"/></span>)
        : null
      }
    </label>
  );
  return props.showLabel ? label : null;
}

export function inputSizeClass(props) {
  switch (props.bsSize) {
    case "small":
      return "input-sm";
    case "large":
      return "input-lg";
    default:
  }
}

export function dataProps(props) {
  return propsStartsWith(props, "data-");
}

export function ariaDescribedBy(props) {
  if (props.help && !props.showError) {
    return R.isNil(props.id) ? `${props.name}-help` : `${props.id}-help`;
  } else if (props.showError) {
    return R.isNil(props.id) ? `${props.name}-error` : `${props.id}-error`;
  }
}

export function ariaProps(props) {
  return propsStartsWith(props, "aria-");
}

export function propsStartsWith(props, startsWith) {
  return R.pipe(
    R.keys(),
    R.filter(key => key.startsWith(startsWith)),
    R.reduce((obj, key) => {
      obj[key] = props[key];
      return obj;
    }, {})
  )(props);
}

export function getFieldId(props) {
  return props.id ? props.id : `${props.name}-input`;
}

export function getValueClass(props) {
  return props.value === "" || props.value === null ? {} : "dirty static";
}

export let propTypes = {
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  label: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object
  ]),
  type: React.PropTypes.string,
  help: React.PropTypes.node,
  helpPos: React.PropTypes.oneOf(["left", "right", "none"]),
  error: React.PropTypes.node,
  hasFeedback: React.PropTypes.bool,
  tableStyle: React.PropTypes.bool,
  headerStyle: React.PropTypes.bool,
  addonBefore: React.PropTypes.node,
  addonAfter: React.PropTypes.node,
  buttonBefore: React.PropTypes.node,
  buttonAfter: React.PropTypes.node,
  bsSize: React.PropTypes.oneOf(["small", "medium", "large"]),
  wrapperClassName: React.PropTypes.string,
  inputGroupContentClassName: React.PropTypes.string,
  showError: React.PropTypes.bool,
  showValidating: React.PropTypes.bool,
  inputWhiteList: React.PropTypes.string,
  applyInputWhiteList: React.PropTypes.bool,
  showRequired: React.PropTypes.bool,
  showHelp: React.PropTypes.bool,
  touched: React.PropTypes.bool,
  access: React.PropTypes.object,
  accessMode: React.PropTypes.string,
  value: React.PropTypes.any
};

export let defaultProps = {
  access: {
    "create": true,
    "read": true,
    "update": true,
    "delete": true
  },
  accessMode: "create",
  inputWhiteList: "[^A-Za-z0-9\\s_.,\\(\\)\\-\\\"\\'\\/\\<\\>]+",
  applyInputWhiteList: true,
  showRequired: true,
  showHelp: false,
  hasFeedback: true,
  showError: false,
  tableStyle: false,
  headerStyle: false,
  bsSize: "small"
};
