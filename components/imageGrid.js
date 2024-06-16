import { Platform, StyleSheet, Text, View } from 'react-native'
import { MasonryFlashList } from "@shopify/flash-list";

import React from 'react'
import ImageCard from './ImageCard';
import { getcolumnCount, wp } from '../helpers/common';

const ImageGrid = ({ images ,router} ) => {
    const colums=getcolumnCount()
    return (
        <View  style={styles.container}>
            <MasonryFlashList
                data={images}
                numColumns={colums}
                renderItem={({ item,index }) => <ImageCard router={router} colums={colums} item={item} index={index} />}
                estimatedItemSize={200}
                contentContainerStyle={styles.listContainerStyle}
                initialNumberToRender={1000}

            />
        </View>
    )
}

export default ImageGrid

const styles = StyleSheet.create({
    container: {
        minHeight:3,
        width:wp(100)
    },
    listContainerStyle:{
        paddingHorizontal:wp(4),


    }
})