import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

type CardsProps = {
    id: number;
  title: string;
  description: string;
  category: string;
  price: number;
}

export default function Cards({id, title, description, category, price}:CardsProps) {
  return (
    <View style={styles.container}>
        <Text style={styles.text}> {id} </Text>
        
        <Text style={styles.text}> {title} </Text>
        
        <Text style={styles.text}> {description} </Text>
        
        <Text style={styles.text}> {category} </Text>
        
        <Text style={styles.text}> {price} </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    backgroundColor: "purple",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    color: "white",
  },
  text: {
    color: "white",
  }
})