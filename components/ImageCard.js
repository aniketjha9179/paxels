import {  Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { getImageSize, wp } from '../helpers/common'
import { theme } from '../constants/theme'

const ImageCard = ({item, index,colums, router}) => {
    const getImageHeight=()=>{
        let {imageHeight:height,imageWidth:width}=item;
        return {height:getImageSize(height,width)};
    }
    const isLastInRow=()=>{
        return (index+1)%colums===0;
    }
  return (
    <Pressable onPress={()=>  router.push({pathname:'home/image', params:{...item}})} style={[styles.ImageWrapper, !isLastInRow() && styles.spacing]} >
      <Image 
          style={[styles.image,getImageHeight()]}
          transition={100}
          source={item?.webformatURL}
          />
      
    </Pressable>
  )
}

export default ImageCard

const styles = StyleSheet.create({
    image:{
        height:300,
        width:"100%"
    },
    ImageWrapper:{
        backgroundColor:theme.colors.grayBG,
        borderRadius:theme.radius.xl,
        borderCurve:"continuous",
        overflow:'hidden',
        marginBottom:wp(1),
    },
    spacing:{
        marginRight:wp(2)
    }
})