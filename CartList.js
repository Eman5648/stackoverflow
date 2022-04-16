import React, { Component } from "react";
import {
    StyleSheet, Button, Text, View,
    TouchableOpacity, FlatList,
    Image, SafeAreaView,
    ActivityIndicator,
    TextInput, Alert
} from "react-native";
import Fire from "../Fire";
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons';

export default class CartList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: this.props.name,
            image: this.props.image,
            qty: this.props.qty,
            price: this.props.price,
            cartId: '',
            found: false
        }

    }

    getcartId() {

        Fire.shared.firestore.collection("cart").where("userId", "==", Fire.shared.uid).get().then((qSnap) => {
            qSnap.docs.map((cart) => {
                this.setState({ cartId: cart.id })
            })
            this.setState({ found: true, loading: false })
        });

        console.log(this.state.cartId)
    }

    remove = (qty, name, p, img) => {
        let q = qty
        if (q > 1) {
            this.getcartId()
            let q = qty
            q -= 1;
            const x = {
                image: img,
                item: name,
                price: p,
                qty: q,

            }
            if (this.state.found) {
                Fire.shared
                    .firestore
                    .collection('cart')
                    .doc(this.state.cartId)
                    .update({
                        items: x

                    })
                this.setState({ qty: q })
            }
        
    }


}

add = (qty, name, p, img) => {
    this.getcartId()
    let q = qty
    q += 1;
    const x = {
        image: img,
        item: name,
        price: p,
        qty: q,

    }
    if (this.state.found) {
        Fire.shared
            .firestore
            .collection('cart')
            .doc(this.state.cartId)
            .update({
                items: x

            })
        this.setState({ qty: q })
    }
}

delete = (q, name, p, img) => {
    this.getcartId()
    const x = {
        image: img,
        item: name,
        price: p,
        qty: q,

    }
    if (this.state.found) {
        Fire.shared.firestore.collection("cart").doc(this.state.cartId).update(
            { items: firebase.firestore.FieldValue.arrayRemove(x) }
        );
        this.props.navigation.push('ShoppingCartScreen')
    }





};

render() {
    return (
        <SafeAreaView>


            <View style={styles.containerStyle}>
                <Image source={{ uri: this.state.image }} style={styles.imageStyle} />

                <View style={styles.textStyle}>
                    <Text style={{ color: '#2e2f30', fontWeight: "bold" }}>{this.state.name}</Text>
                    <View style={styles.priceStyle}>
                        <Text style={{ color: '#2e2f30', fontSize: 17 }}>€{this.state.price}</Text>
                    </View>
                </View>

                <View style={styles.counterStyle} >
                    <TouchableOpacity onPress={() => this.remove(this.state.qty, this.state.name,
                        this.state.price, this.state.image)}>
                        <Icon
                            name="ios-remove"
                            size={21}
                            color='black'

                            style={{ marginTop: 30, borderRadius: 20, height: 20, width: 20 }}
                            iconStyle={{ marginRight: 0 }}

                        />
                    </TouchableOpacity>


                    <Text style={{ marginTop: 30 }}>{this.state.qty}</Text>

                    <TouchableOpacity onPress={() => this.add(this.state.qty, this.state.name,
                        this.state.price, this.state.image)}>
                        <Icon
                            name="ios-add"
                            size={21}
                            color='black'
                            backgroundColor='#fff'
                            style={{ marginTop: 30, borderRadius: 20, height: 20, width: 20 }}
                            iconStyle={{ marginRight: 0 }}
                        />

                    </TouchableOpacity>

                </View>
                <View>
                    <TouchableOpacity onPress={() => this.delete(this.state.qty, this.state.name,
                        this.state.price, this.state.image)}>
                        <Icon
                            name="md-close"
                            size={25}
                            color='black'
                            style={{ height: 25, width: 25 }}
                            iconStyle={{ marginRight: 0 }}

                        />
                    </TouchableOpacity>

                </View>

            </View>

        </SafeAreaView>
    );
}
}


const styles = StyleSheet.create({

    containerStyle: {
        flexDirection: 'row',
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#e2e2e2',
        padding: 10,
        paddingLeft: 15,
        backgroundColor: '#fff'
    },
    lastItemStyle: {
        flexDirection: 'row',
        flex: 1,
        padding: 10,
        paddingLeft: 15,
        backgroundColor: '#fff'
    },
    imageStyle: {
        width: 110,
        height: 110,
        marginRight: 20
    },
    textStyle: {
        flex: 2,
        justifyContent: 'center'
    },
    priceStyle: {
        backgroundColor: '#ddd',
        width: 40,
        alignItems: 'center',
        marginTop: 3,
        borderRadius: 3
    },
    counterStyle: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    containerStyle1: {
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