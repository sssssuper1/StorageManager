import React, { Component } from 'react';
import { StackActions, NavigationActions } from 'react-navigation';
import Cookie from 'react-native-cookie';
import Fetch from '../js/fetch';
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
    Dimensions,
    Alert,
    Modal,
    Button,
    FlatList,
} from 'react-native';
import pxToDp from '../js/pxToDp';

const deviceHeightDp = Dimensions.get('window').height;
function scrrollHeight(uiElementHeight) {
  return deviceHeightDp-uiElementHeight;
}

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataList: [],
            name: 'Admin',
            refreshing: false,
            isToday: true
        }

        this.page = 0;

        this.loadData('0');
    }

    // 后台获取数据
    loadData(pageIndex, reload = true, isToday = true) {
        let now = new Date();
        let end;
        let start;

        if (isToday) {
            end = now.toISOString();
            start = new Date(Date.parse(end.toString()) - 24 * 3600 * 1000).toISOString();
        } else {
            end = new Date(Date.parse(now.toString()) - 24 * 3600 * 1000).toISOString();
            start = new Date(Date.parse(now.toString()) - 48 * 3600 * 1000).toISOString();
        }

        
        Fetch(global.url + `/admin/Stocks/GetRecordList?End=${end}&Start=${start}&pageIndex=${pageIndex}&pageSize=25`,
            'GET',
            '',
            (res) => {
                if (res.result) {
                    if (reload) {
                        this.setState({
                            dataList: res.data.list,
                            refreshing: false
                        });
                    } else {
                        let list = this.state.dataList;
                        list.push(...res.data.list);
                        this.setState({
                            dataList: list
                        })
                    }
                } else {
                    alert(res.errMsg);
                }
            },
            (err) => {
                alert(err)
            }
        )
    }

    // 登出
    logout() {
        global.storage.remove({
            key: 'Cookie'
        });

        Cookie.clear();
        
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });
        
        this.props.navigation.dispatch(resetAction);
    }

    changeDate(isToday) {
        this.loadData('0', true, isToday);
        this.setState({
            isToday: isToday
        });
    }

    // 下拉刷新
    listRefresh() {
        this.page = 0;
        this.setState({
            refreshing: true,
            isToday: true
        });

        this.loadData('0');
    }

    // 上拉加载
    listLoadMore() {
        if (this.state.dataList.length < 25) {
            return;
        } else {
            this.page++;
        this.loadData(this.page, false)
        }
    }

    callBack() {
        this.loadData('0');
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View><Text style={styles.userName}>{this.state.name}</Text></View>
                    <TouchableOpacity onPress={() => this.logout()}>
                        <Image style={styles.logout} source={require('../images/logout.png')}/>    
                    </TouchableOpacity>    
                </View>    
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigate('InputInfo', {callBack: this.callBack.bind(this)})} style={styles.wareHousing}>
                        <Text style={styles.wareHouseText}>入库</Text>
                    </TouchableOpacity>    
                </View>
                <View style={styles.listContainer}>
                    <View style={styles.listTitle}>
                        <TouchableOpacity style={this.state.isToday ? styles.yesterday : styles.hidden} onPress={() => this.changeDate(false)}>
                            <Text style={styles.dateText}>昨日记录</Text>    
                        </TouchableOpacity>
                        <Text style={styles.listTitleText}>入库记录</Text>
                        <TouchableOpacity style={!this.state.isToday ? styles.today : styles.hidden} onPress={() => this.changeDate(true)}>
                            <Text style={styles.dateText}>今日记录</Text>
                        </TouchableOpacity>
                    </View>    
                    <FlatList
                        style={styles.list}    
                        data={this.state.dataList}
                        onRefresh={this.listRefresh.bind(this)}
                        refreshing={this.state.refreshing}
                        ItemSeparatorComponent={({ highlighted }) => (<View style={styles.separator}></View>)}
                        onEndReached={this.listLoadMore.bind(this)}
                        onEndReachedThreshold={0.25}
                        renderItem={({ item }) => 
                            <View style={styles.recordContent}>
                                <View style={styles.listInfo1}>
                                    <Text>货号：{item.productCode}</Text>
                                    <Text>{item.createTime}</Text>
                                </View>
                                <View style={styles.listInfo2}>
                                    <Text style={styles.goodName}>{item.goodName}</Text>
                                    <Text>x {item.num}</Text>    
                                </View>
                            </View>}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        paddingLeft: pxToDp(34),
        paddingRight: pxToDp(34),
        backgroundColor: 'white'
    },
    hidden: {
        display: 'none'
    },
    header: {
        width: '100%',
        height: pxToDp(100),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    userName: {
        fontSize: pxToDp(30),
        color: 'black'
    },
    logout: {
        width: pxToDp(50),
        height: pxToDp(50)
    },
    buttonContainer: {
        width: '100%',
        height: pxToDp(150),
        marginBottom: pxToDp(30),
        justifyContent: 'center',
        alignItems: 'center'
    },
    wareHousing: {
        width: pxToDp(400),
        height: pxToDp(120),
        borderWidth: pxToDp(3),
        borderColor: 'black',
        borderRadius: pxToDp(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    wareHouseText: {
        fontSize: pxToDp(40),
    },
    listContainer: {
        borderTopWidth: pxToDp(1),
        borderTopColor: '#2abd89',
    },
    listTitle: {
        position: 'relative',
        width: '100%',
        height: pxToDp(100),
        justifyContent: 'center',
        alignItems: 'center'
    },
    yesterday: {
        position: 'absolute',
        left: pxToDp(0)
    },
    today: {
        position: 'absolute',
        right: pxToDp(0)
    },
    dateText: {
        fontSize: pxToDp(24),
        color: '#2abd89'
    },
    listTitleText: {
        fontSize: pxToDp(36)
    },
    list: {
        width: '100%',
        height: scrrollHeight(pxToDp(450))
    },
    recordContent: {
        width: '100%',
        height: pxToDp(140)
    },
    listInfo1: {
        width: '100%',
        height: pxToDp(60),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    listInfo2: {
        position: 'relative',
        width: '100%',
        height: pxToDp(80),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    goodName: {
        fontSize: pxToDp(30),
    },
    goodNum: {
        fontSize: pxToDp(30),
    },
    separator: {
        width: '100%',
        height: pxToDp(1),
        backgroundColor: '#2abd89'
    }
});

