import React, { Component } from 'react';
import Fetch from '../js/fetch';
import pxToDp from '../js/pxToDp';
import Cookie from 'react-native-cookie';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ListView,
    Easing,
    ImageBackground,
    Alert,
    Modal,
    Button,
    FlatList,
    Picker
} from 'react-native';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: '',
            password: '',
            isHidden: true,
            disabled: true
        }
    }
    isHidden(){
        let isHidden=!this.state.isHidden;
        this.setState({isHidden:isHidden})
    }

    accountInput(text){
        let disabled=true
        if(text.length>0&&this.state.password.length>0){
            disabled = false
        }
        this.setState({disabled:disabled,account:text})
    }

    passwordInput(text){
        let disabled=true
        if(this.state.account.length>0&&text.length>0){
            disabled = false
        }
        this.setState({disabled:disabled,password:text}) 
    }

    login() {
        let params = {
            userName: this.state.account,
            pwd: this.state.password
        }
        Fetch(global.url + '/admin/common/UserLogin', 'POST', params,
            (res) => {
                if (res.Success) {
                    global.storage.save({
                        key: 'Cookie',
                        data: {
                            userId: res.USERID    
                        }
                    });
                    // Cookie.get(global.url, 'superUserId').then(
                    //     (cookie) => {
                    //         alert(cookie);
                    this.props.navigation.replace('Home');
                    //     }
                    // )
                } else {
                    alert(res.Reason);
                }
            },
            (err) => {
                alert(err);
            }
        );
        global.storage.save({
            key: 'Cookie',
            data: {
            userId: 'TestUser'
            }
        });
    }
    
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>登录</Text>  
                </View>
                <View style={styles.content}>
                    <View style={styles.Item}>
                        <Text>账户</Text>
                        <TextInput
                            maxLength={11}
                            style={styles.account}
                            underlineColorAndroid={'transparent'}
                            onChangeText={(text) =>this.accountInput(text) }
                            placeholder={'请输入登录账户'}
                            placeholderTextColor={'#a6a6a6'}
                        />
                    </View>
                    <View style={styles.Item}>
                        <Text>密码</Text>
                        <TextInput
                            maxLength={11}
                            style={styles.account}
                            underlineColorAndroid={'transparent'}
                            onChangeText={(text) => this.passwordInput(text)}
                            secureTextEntry={this.state.isHidden}
                            placeholder={'请输入登录密码'}
                            placeholderTextColor={'#a6a6a6'}
                        />
                        <TouchableOpacity onPress={()=>this.isHidden()} style={styles.btnPasswrd}>
                            <Image style={this.state.isHidden ? styles.hidenPassword : styles.opacity} source={require('../images/hiddenPassword.png')}></Image>
                            <Image style={this.state.isHidden ? styles.opacity : styles.showPassword} source={require('../images/showPassword.png')}></Image>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={this.login.bind(this)} disabled={this.state.disabled} style={this.state.disabled?styles.signIn:styles.signIn1}><Text style={{color:"white"}}>登录</Text></TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: 'white'
    },
    header:{
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        height: pxToDp(96),
        ...Platform.select({
          ios: {
            marginTop: pxToDp(28)
          },
          android: {}
        })
    },
    headerText: {
        fontSize: pxToDp(36),
        color: '#020202'
    },
    opacity: {
      display: 'none'
    },
    content: {
      paddingLeft: pxToDp(34),
      paddingRight: pxToDp(34),
      marginTop: pxToDp(14),
      backgroundColor: 'white'
    },
    Item: {
      position: 'relative',
      flexDirection: 'row',
      height: pxToDp(104),
      alignItems: 'center',
      borderBottomWidth: pxToDp(2),
      borderBottomColor: '#f1f1f1'
    },
    account: {
      flex:1,
      height:"100%",
      paddingLeft: pxToDp(20)
    },
    btnPasswrd:{
      width: pxToDp(80),
      height: "100%",
      justifyContent: 'center',
      alignItems:"center"
    },
    hidenPassword: {
      width: pxToDp(42),
      height: pxToDp(24)
    },
    showPassword: {
      width: pxToDp(44),
      height: pxToDp(28)
    },
    signIn: {
      marginTop: pxToDp(34),
      height: pxToDp(84),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#d0d0d0'
    },
    signIn1:{
      marginTop: pxToDp(34),
      height: pxToDp(84),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#2abd89'
    },
});