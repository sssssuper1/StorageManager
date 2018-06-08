/**
 * Warehouse Management React Native App
 * @flow
 */

import React, { Component } from 'react';
import { storage } from './src/js/StorageUtil';
import { createStackNavigator } from 'react-navigation';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Login from './src/pages/Login';
import Home from './src/pages/Home';
import InputInfo from './src/pages/InputInfo';
import Scan from './src/pages/Scan';

global.storage = storage;
global.url = "http://192.168.0.124:9001";

class LoginScreen extends Component {
  static navigationOptions = {
    header:null
  };
  render() {
    return (
      <Login navigation={this.props.navigation}/>
    );
  }
}

class HomeScreen extends Component {
  static navigationOptions = {
    header:null
  };
  render() {
    return (
      <Home navigation={this.props.navigation}/>
    );
  }
}

class InputInfoScreen extends Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <InputInfo navigation={this.props.navigation} />
    );
  }
}

class ScanScreen extends Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <Scan navigation={this.props.navigation} />
    );
  }
}

function configAppNavigator(isLoggeIn) {
  return createStackNavigator({
    // 登录
    Login: {
      screen: LoginScreen,
    },
    // 主页
    Home: {
      screen: HomeScreen,
    }, 
    // 入库
    InputInfo: {
      screen: InputInfoScreen,
    },
    // 扫码
    Scan: {
      screen: ScanScreen
    }
  }, {
    initialRouteName: isLoggeIn ? 'Home' : 'Login'
  });
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedLogin: false,
      isLoggedIn: false
    }
  }

  componentDidMount() {
    global.storage.load({
      key: 'Cookie'
    }).then(ret => {
      this.setState({
        checkedLogin: true
      });
      if (!!ret && !!ret.userId) {
        this.setState({
          isLoggedIn: true
        });
      }
    }).catch(err => {
      this.setState({
        checkedLogin: true
      });
    });
  }

  render() {
    const { checkedLogin, isLoggedIn } = this.state;

    if (!checkedLogin) {
      return null;
    }

    const RootNavigator = configAppNavigator(isLoggedIn);
    return <RootNavigator />;
  }
}