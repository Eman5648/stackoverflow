import React, { Component } from 'react';
import {
    View,
    FlatList,
    Image,
    ActivityIndicator,
    Dimensions,
    ScrollView,
    Button,
    StatusBar,
    StyleSheet,
    Text
} from "react-native";
import Fire from '../Fire'
import { Ionicons } from "@expo/vector-icons";
import Header from '../components/Header'
import CartList from '../components/CartList'
import TotalCartItem from '../components/TotalCartItem'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { TouchableRipple } from "react-native-paper";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class ShoppingCartScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            uid: Fire.shared.uid,
            cartList: [],
            name: '',
            price: '',
            image: '',
            qty: '',
            totalItems: '',
            totalPrice: '',
            loading: true
        }

    }


    componentDidMount() {
        this.getMyCarts()
    }


    getMyCarts = () => {
        Fire.shared.firestore.collection("cart").where("userId", "==", this.state.uid).get().then((qSnap) => {
            let itemList = [];
            let total = 0;
            qSnap.docs.forEach(item => {
                itemList.push(...item.data().items) // <---- added spread syntax
            })
            this.setState({
                cartList: itemList, loading: false
            })

            itemList.map((p) => {
                total += p.price
            })

            this.setState({
                totalItems: this.state.cartList.length, totalPrice: total
            })

            //console.log("Cart List", this.state.totalItems);

        });


    }

    render() {
        switch (this.state.loading) {
            case false:
                return (
                    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                        <StatusBar barStyle='light-content' hidden={false} backgroundColor='#C62828' translucent={false} />
                        <Header
                            title={'Cart'}
                            RightIcon={
                                <TouchableRipple
                                    onPress={() => this.props.navigation.push('ShopScreen')}
                                    rippleColor="rgba(0, 0, 0, .32)"
                                    borderless={true}
                                >
                                    <MaterialIcons
                                        name='chevron-left'
                                        color='#000'
                                        size={30}
                                    />
                                </TouchableRipple>
                            }
                        />

                        {
                            this.state.cartList.length > 0 ?
                                <React.Fragment>
                                    <ScrollView backgroundColor='#bbb'>
                                        {this.state.cartList.map((c) => (
                                            <CartList
                                                name={c.item}
                                                price={c.price}
                                                qty={c.qty}
                                                image={c.image}
                                                navigation={this.props.navigation}

                                            />
                                        ))}
                                    </ScrollView>


                                    <View style={styles.containerStyle} key="1">
                                        <TotalCartItem
                                            totalitems={this.state.totalItems}
                                            totalprice={this.state.totalPrice} />
                                        <View style={styles.buttonContainerStyle}>
                                            <View >
                                                <Button color='#7f8c8d' title="Close"
                                                    onPress={() => this.props.navigation.goBack()} />
                                            </View>

                                            <View >
                                                <Button color='#f39c12' title="Go to checkout"
                                                    onPress={() => this.props.navigation.push('CheckOutScreen')} />
                                            </View>
                                        </View>
                                    </View>
                                </React.Fragment>
                                : <Image style={{ justifyContent: 'center', height: 500, width: 400 }}
                                    source={require('../assets/images/emptycart.jpg')}></Image>

                        }
                    </View>
                )
            default:
                return <View style={styles.loading} >
                    <ActivityIndicator size='large' color='#303233' />
                </View>
        }
    }
}

const styles = StyleSheet.create({


    containerStyle: {
        flex: 1,
        paddingRight: 15,
        paddingLeft: 15,
        justifyContent: 'center'
    },
    buttonContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 50,
    },
    closeButtonStyle: {
        backgroundColor: '#7f8c8d',
        padding: 10,
        paddingRight: 30,
        paddingLeft: 30,
        borderRadius: 3,
    },
    checkoutButtonStyle: {
        backgroundColor: '#f39c12',
        padding: 10,
        paddingRight: 60,
        paddingLeft: 60,
        borderRadius: 3,
    }
})

ShoppingCartScreen.shared = new ShoppingCartScreen()