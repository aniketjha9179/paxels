import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FontAwesome6, AntDesign, EvilIcons, Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import { server } from 'typescript';
import Categories from '../../components/categories';
import { apiCall } from '../../api';
import ImageGrid from '../../components/imageGrid';
import { debounce, filter } from 'lodash'
import FilterModal from '../../components/filterModal';
import { useRouter } from 'expo-router';





let page = 1;

const HomeScreen = () => {
  const { top } = useSafeAreaInsets()
  const paddingTop = top > 0 ? top + 10 : 30
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [images, setImages] = useState([])
  const [filters, setFilters] = useState(null)
  const searchInputRef = useRef()
  const modalRef = useRef(null)
  const scrollRef = useRef(null)
  const router=useRouter()
  const[isEndReached, setIsEndReached]=useState(false)



  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async (params = { page: 1 }, append = true) => {
    console.log("params", params, append);
    let res = await apiCall(params)
    if (res.success && res?.data?.hits) {
      if (append)
        setImages([...images, ...res.data.hits])
      else
        setImages([...res.data.hits])
    }
  }

  // to open and close modal
  const openFiltersModal = () => {
    modalRef?.current?.present()
  }
  const closeFiltersModal = () => {
    modalRef?.current?.close();
  }

  // clearFilter def
  const clearThisFilter = (filterName) => {
    let filterz = { ...filters };
    delete filterz[filterName];
    setFilters({ ...filterz })
    page = 1;
    setImages([]);
    let params = {
      page,
      ...filterz
    }
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false)
  }


  const handleChangeCategory = (cat) => {
    setActiveCategory(cat)
    clearSearch()
    setImages([])
    page = 1;
    let params = {
      page,
      ...filters
    }
    if (cat) params.category = cat;
    fetchImages(params, false)
  }
  // function for applying filters
  const applyFilters = () => {
    if (filters) {
      page = 1;
      setImages([])
      let params = {
        page,
        ...filters
      }
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false)
    }
    closeFiltersModal()
  }

  // function for reset filters
  const resetFilters = () => {

    if (filters) {
      page = 1;
      setFilters(null)
      setImages([])
      let params = {
        page,
      }
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false)
    }
    closeFiltersModal()
  }


  const handleSearch = (text) => {
    setSearch(text)
    if (text.length > 2) {
      // search for this text
      page = 1;
      setImages([])
      setActiveCategory(null) //clear category  when searching
      fetchImages({ page, q: text, ...filters }, false)

    }
    if (text == "") {
      // reset results 
      page = 1;
      searchInputRef?.current?.clear()
      setImages([])
      setActiveCategory(null) //clear category  when searching

      fetchImages({ page, ...filters }, false)


    }

  }
  const clearSearch = () => {
    setSearch("")
    searchInputRef?.current?.clear()
  }
  // handle scrollbar func
  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;
    
    if(scrollOffset>=bottomPosition-1){
      if(!isEndReached){
        setIsEndReached(true)
        console.log("Reached the bottom of the scrollView");
        // fetch more images
        ++page;
        let params={
          page, 
          ...filters
        }
        if(activeCategory) params.category=activeCategory
        if(search) params.q=search;
        fetchImages(params)
      }


    }else if(isEndReached){
      setIsEndReached(false)
    }



  }

  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true
    })
  }
  // func with text deBounce
  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>
            Unsplash
          </Text>
        </Pressable>
        <Pressable onPress={openFiltersModal}  >
          <FontAwesome6 name="bars-staggered" size={24} color="black" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ gap: 15 }}
        onScroll={handleScroll}
        scrollEventThrottle={5}//how oftern scroll evnet will fire while scrolling (in ms)
        ref={scrollRef}
      >
        {/* searchBar */}
        <View style={styles.searchBar}>
          <View style={styles.serachIcon}>
            <AntDesign name="search1" size={24} color={theme.colors.neutral(0.7)} />
          </View>
          <TextInput
            // value={search}
            // using this to clearn the text inside
            ref={searchInputRef}
            onChangeText={handleTextDebounce}
            placeholder='search for photos'
            style={styles.serachInput}
          />
          {/* remember to use this code  in other cases also  */}
          {
            search && (
              <Pressable onPress={() => handleSearch("")} style={styles.closeIcon}>
                <EvilIcons name="close" size={24} color={theme.colors.neutral(0.7)} />
              </Pressable>

            )
          }

        </View>
        {/* categories */}
        <View style={styles.categories}>
          <Categories activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>
        {/*applied filter  */}
        {
          filters && (
            <View style >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filters}
              >
                {
                  Object.keys(filters).map((key, index) => {
                    return (
                      <View key={key} style={styles.filterItem}>
                        {
                          key == "colors" ? (
                            <View style={{ height: 20, width: 30, borderRadius: 7, backgroundColor: filters[key] }} />
                          ) : (
                            <Text style={styles.filterItemText}>{filters[key]} </Text>
                          )
                        }
                        <Pressable style={styles.filterCloseIcon}
                          onPress={() => clearThisFilter(key)}
                        >
                          <Ionicons name='close' size={14} color={theme.colors.neutral(0.9)} />
                        </Pressable>
                      </View>
                    )
                  })
                }

              </ScrollView>
            </View>
          )
        }

        {/* images grid  masonry grid*/}
        <View>
          {
            images.length > 0 && <ImageGrid images={images} router={router} />
          }
        </View>
        {/* loading */}
        <View style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}>
          <ActivityIndicator size={'large'} color={'red'} animating={true} />

        </View>

      </ScrollView>
      {/* filter modal */}
      <FilterModal
        modalRef={modalRef}
        filters={filters}
        setFilters={setFilters}
        onClose={closeFiltersModal}
        onReset={resetFilters}
        onApply={applyFilters}
      />
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,

  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9)
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: 'white',
    padding: 6,
    borderRadius: theme.radius.lg,
    paddingLeft: 10,


  },
  serachIcon: {
    padding: 6
  },
  serachInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(2.8),
    color: theme.colors.neutral(0.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    borderRadius: theme.radius.sm,
    padding: 1

  },
  filters: {
    paddingHorizontal: wp(4),
    gap: 10
  },
  filterItem: {
    backgroundColor: theme.colors.grayBG,
    padding: 3,
    flexDirection: 'row',
    borderRadius: theme.radius.xs,
    padding: 8,
    paddingHorizontal: 10,
    gap: 10,
    alignItems: 'center'

  },
  filterItemText: {
    fontSize: hp(1.9),


  },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(.2),
    padding: 4,
    borderRadius: 7
  }


})