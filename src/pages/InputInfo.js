import React, { Component } from 'react';
import Header from '../components/Header';
import Fetch from '../js/fetch';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
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
import pxToDp from '../js/pxToDp';

function formatDate (value){
    if(value.length == 8){
        return value.substring(0, 4) + "-" + value.substring(4, 6) + "-" + value.substring(6, 8);
    } else if(value.length == 6){
        return value.substring(0, 4) + "-0" + value.substring(4, 5) + "-0" + value.substring(5, 6);
    } else {
        return value;
    }
}

export default class InputInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            radioProps: [
                { label: '供应商', value: '供应商入库' },
                { label: '退货', value: '退货入库' },
                { label: '换货', value: '换货入库' }
            ],
            selectedRadio: '供应商入库',
            productCode: '',
            info: {
                show: false,
                goodName: '',
                spec: '',
                goodnum: ''
            },
            supppliers: [],
            supplier: null,
            selectedSupplier: '',
            qualityDate: '',
            count: 0,
            remarks: ''
        };

        this.getSupplierList();
    }

    getSupplierList() {
        Fetch(global.url + '/admin/Stocks/GetSupplierList?pageIndex=0&pageSize=9999',
            'GET', '',
            (res) => {
                if (res.result) {
                    if (res.data != null) {
                        this.setState({
                            supppliers: res.data.list,
                            supplier: res.data.list[0],
                            selectedSupplier: res.data.list[0].id
                        });
                    }
                } else {
                    alert(res.errMsg);
                }
            },
            (err) => {
                alert(err);
            }
        )
    }

    search() {
        Fetch(global.url + '/admin/Stocks/GetGoods?productCode=' + this.state.productCode,
            'GET', '',
            (res) => {
                if (res.result) {
                    if (res.data != null) {
                        this.setState({
                            info: {
                                show: true,
                                goodName: res.data.goodName,
                                spec: res.data.spec,
                                goodnum: res.data.goodnum
                            }
                        });
                    } else {
                        this.setState({
                            info: {
                                show: false
                            }
                        });
                    }
                } else {
                    alert(res.errMsg);
                }
            },
            (err) => {
                alert(err);
            }
        )
    }

    changeRadio(value) {
        this.setState({
            selectedRadio: value
        });
    }

    callBack(productCode) {
        this.setState({
            productCode: productCode
        }, () => this.search());
    }

    submit() {
        let params = {
            expirationDate: formatDate(this.state.qualityDate) + 'T16:00:00.000Z',
            num: this.state.count,
            productCode: this.state.productCode,
            supplier: this.state.supplier,
            supplierId: this.state.selectedSupplier,
            type: this.state.selectedRadio,
            remark: this.state.remarks
        };

        Fetch(global.url + '/admin/stocks/AddRecord',
            'POST', params,
            (res) => {
                if (res.result) {
                    this.props.navigation.state.params.callBack();
                    this.props.navigation.goBack();
                } else {
                    alert(res.errMsg);
                }
            },
            (err) => {
                alert(err);
            }
        )
    }

    render() {
        const { navigate } = this.props.navigation;
        let picker;
        if (Platform.OS == 'android') { 
            picker =
            <View style={styles.colume}>
                <Text style={styles.title}>供应商</Text>
                <Picker
                    style={styles.Picker}
                    selectedValue={this.state.selectedSupplier}
                    onValueChange={(value, index) => this.setState({
                        selectedSupplier: value,
                        supplier: this.state.supppliers[index]
                    })}>
                    {this.state.supppliers.map(item => <Picker.Item label={item.name} value={item.id} />)}
                </Picker>
            </View>
        }
        return (
            <View style={styles.container}>
                <ScrollView>    
                    <Header navigation={this.props.navigation} name='添加入库'/>
                    <View style={styles.body}>
                        <View style={styles.colume}>
                            <Text style={styles.title}>类型</Text>
                            <RadioGroup
                                style={styles.radio}    
                                color='#2abd89'
                                selectedIndex={0}
                                onSelect={(index, value) => this.setState({ selectedRadio: value })}>
                                {this.state.radioProps.map(item => 
                                    <RadioButton value={item.value}>
                                        <Text>{item.label}</Text>
                                    </RadioButton>)}
                            </RadioGroup>    
                        </View>
                        <View style={styles.colume}>
                            <Text style={styles.title}>条码</Text>
                            <TextInput
                                style={styles.textInput}    
                                keyboardType={'numeric'}
                                value={this.state.productCode}
                                onChangeText={(text) => this.setState({ productCode: text })}
                                onSubmitEditing={this.search.bind(this)}
                                underlineColorAndroid={'transparent'}
                            />
                            <TouchableOpacity style={styles.getCode} onPress={() => navigate('Scan', {callBack: this.callBack.bind(this)})}>
                                <Image style={styles.camera} source={require('../images/getCord.png')} />
                            </TouchableOpacity>    
                        </View>
                        <View style={this.state.info.show ? styles.goodInfoCol : styles.hidden}>    
                            <Text style={styles.goodInfo}>商品名称：{this.state.info.goodName}</Text>
                            <Text style={styles.goodInfo}>规格：{this.state.info.spec}</Text>
                            <Text style={styles.goodInfo}>货号：{this.state.info.goodnum}</Text>
                        </View>
                        {picker}
                        <View style={styles.colume}>
                            <Text style={styles.title}>质保期</Text>
                            <TextInput
                                style={styles.textInput}        
                                keyboardType={'numeric'}
                                onChangeText={value => this.setState({ qualityDate: value })}
                                underlineColorAndroid={'transparent'}
                                placeholder={'YYYYMMDD'}
                                maxLength={8}
                            />
                        </View>
                        <View style={styles.colume}>
                            <Text style={styles.title}>数量</Text>
                            <TextInput
                                style={styles.textInput}    
                                keyboardType={'numeric'}
                                onChangeText={value => this.setState({ count: value })}
                                underlineColorAndroid={'transparent'}
                            />
                        </View>
                        <View style={styles.colume}>
                            <Text style={styles.title}>备注</Text>
                            <TextInput
                                style={styles.textInput}    
                                onChangeText={value => this.setState({ remarks: value })}
                                underlineColorAndroid={'transparent'}
                            />
                        </View>
                    </View>
                </ScrollView>    
                <TouchableOpacity style={styles.submit} onPress={this.submit.bind(this)}>
                    <Text style={styles.submitText}>提交</Text>    
                </TouchableOpacity>
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
    hidden: {
        display: 'none'
    },
    body: {
        paddingLeft: pxToDp(34),
        paddingRight: pxToDp(34),
        paddingBottom: pxToDp(100)
    },
    colume: {
        position: 'relative',
        width: '100%',
        height: pxToDp(104),
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: pxToDp(2),
        borderTopColor: '#f1f1f1'
    },
    goodInfoCol: {
        position: 'relative',
        width: '100%',
        height: pxToDp(70),
        flexDirection: 'row',
        alignItems: 'center',
    },
    Picker: {
        flex: 1,
        color: '#a9a9a9',
        height: pxToDp(82),
        backgroundColor:'white'
    },
    title: {
        fontSize: pxToDp(32),
        color: '#000000'
    },
    textInput: {
        position: 'absolute',
        left: pxToDp(100),
        width: pxToDp(550),
    },
    radio: {
        marginLeft: pxToDp(30),
        width: pxToDp(550),
        flexDirection: 'row',
    },
    getCode: {
        position: 'absolute',
        right: 0,
    },
    camera: {
        width: pxToDp(60),
        height: pxToDp(60)
    },
    goodInfo: {
        fontSize: pxToDp(22),
        marginRight: pxToDp(20)
    },
    submit: {
        position: "absolute",
        bottom: 0,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: pxToDp(100),
        backgroundColor: '#2abd89'
    },
    submitText: {
        fontSize: pxToDp(32),
        color: 'white'
    }
});