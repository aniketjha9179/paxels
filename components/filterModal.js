import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import {
    BottomSheetModal,
    BottomSheetView,

} from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import Animated, { Extrapolation, FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { capitalize, hp } from '../helpers/common';
import { theme } from '../constants/theme';
import { ColorFilter, CommonFilterRow, SectionView } from './filterViews';
import { data } from '../constants/data';




const FilterModal = ({
    modalRef,
    onClose,
    onApply,
    onReset,
    filters,
    setFilters
}) => {
    const snapPoints = useMemo(() => ['75%'], []);

    return (
        <BottomSheetModal
            ref={modalRef}
            index={0}
            snapPoints={snapPoints}
            // onChange={handleSheetChanges}
            enablePanDownToClose={true}
            backdropComponent={customBackdrop}
        >
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.content}>
                    <Text style={styles.filter}>Filters</Text>
                    {
                        Object.keys(sections).map((sectionName, Index) => {
                            let sectionView = sections[sectionName]
                            let title = capitalize(sectionName);
                            let sectionData = data.filters[sectionName];

                            return (
                                <Animated.View 
                                entering={FadeInDown.delay((Index*100)+100).springify().damping(11)}
                                 key={sectionName}
                                >
                                    <SectionView
                                        key={sectionName}
                                        title={title}
                                        content={sectionView({
                                            data: sectionData,
                                            filters,
                                            setFilters,
                                            filterName: sectionName,


                                        })}
                                    />
                                </Animated.View>
                            )
                        })
                    }
                </View>
                {/* actions  */}
                <Animated.View style={styles.buttons}
                entering={FadeInDown.delay(500).springify().damping(11)}

                >
                    <Pressable style={styles.resetbtn}
                        onPress={onReset}
                    >
                        <Text style={[styles.buttonText ,{color:theme.colors.neutral(0.9)},{fontSize:15}]}>Reset </Text>
                    </Pressable>

                    <Pressable style={styles.applyBtn}
                        onPress={onApply}
                    >
                        <Text style={[styles.buttonText,{color:theme.colors.white},{fontSize:15}]}>Apply  </Text>
                    </Pressable>
                </Animated.View>
            </BottomSheetView>
        </BottomSheetModal>
    )
}

const sections = {
    "order": (props) => <CommonFilterRow  {...props} />,
    "orientation": (props) => <CommonFilterRow  {...props} />,
    "type": (props) => <CommonFilterRow  {...props} />,
    "colors": (props) => <ColorFilter  {...props} />,

}

const customBackdrop = ({ animatedIndex, style }) => {
    const containerAnimatedStyle = useAnimatedStyle(() => {
        let opacity = interpolate(
            animatedIndex.value,
            [-1, 0],
            [0, 1],
            Extrapolation.CLAMP

        )
        return {
            opacity
        }
    })


    const containerStyle = [
        StyleSheet.absoluteFill,
        style,
        styles.overlay,
        containerAnimatedStyle

    ]
    return (
        <Animated.View style={containerStyle}>
            {/* blur view */}
            <BlurView
                style={StyleSheet.absoluteFill}
                tint="dark"
                intensity={25}
                experimentalBlurMethod='dimezisBlurView'

            />
        </Animated.View>
    )

}

export default FilterModal

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',

    },
    content: {
        flex: 1,
        gap: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
        // width: '100%',
    },
    filter: {
        fontSize: hp(4),
        fontWeight: 'semibold',
        color: theme.colors.neutral(0.8),
        marginBottom: 5
    },
    buttons: {
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        gap:10,
        marginTop:240
    },
    resetbtn: {
        flex:1,
        backgroundColor:theme.colors.neutral(0.03),
        padding:12,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:theme.radius.md,
        borderCurve:'continuous',
        borderWidth:2,
        borderColor:"gray",
        marginLeft:4    
    },
    buttonText: {
        fontSize:hp(2.2),
        
    },
    applyBtn:{
        flex:1,
        backgroundColor:theme.colors.neutral(0.8),  
        padding:12,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:theme.radius.md,
        borderCurve:'continuous',
        marginRight:4,


    }

})