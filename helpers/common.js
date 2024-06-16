import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

export const wp = percentage => {
    const width = deviceWidth;
    return (percentage * width) / 100;
}
export const hp = percentage => {
    const height = deviceHeight;
    return (percentage * height) / 100;
}


export const getcolumnCount = () => {
    if (deviceWidth >= 1024) {
        // desktop
        return 4

    }
    // tablet
    else if (deviceWidth >= 768) {
        return 3

    }
    else{
        // phone
        return 2
    }

}

export const getImageSize =(height, width)=>{
    if(width>height){
        // landscape
        return 270;
    }
    else if(width<height){
        // portrait
        return 350
    }
    else{
        // squareImage
        return 200
    }
}


export const capitalize =str=>{
    return str.replace(/\b\w/g, l => l.toUpperCase())
}