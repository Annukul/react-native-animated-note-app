/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useCallback, useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  View,
  Pressable,
  FlatList,
} from 'react-native';
import {GestureHandlerRootView, TextInput} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ListItem} from './ListItem';
import {AddIcon, CancelIcon} from './src/styles/icons/icons';

const NOTES = [
  {
    index: 0,
    title: 'Important',
    desc: 'This is a very important note. Pls remind me of this',
  },
];

export interface TaskInterface {
  title: string;
  desc: string;
  index: number;
}

const BACKGROUND_COLOR = '#FAFBFF';

const Swiper = () => {
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteDesc, setNoteDesc] = useState<string>('');
  const [tasks, setTasks] = useState(NOTES);
  const translateY = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(translateY.value * 750),
      },
    ],
  }));

  const handleAddNote = () => {
    translateY.value = 0;
  };
  const handleCancelAddNote = () => {
    translateY.value = 1;
  };

  const handleAddNewNote = () => {
    const data = JSON.parse(JSON.stringify(NOTES));
    data.push({
      index: tasks.length + 1,
      title: noteTitle,
      desc: noteDesc,
    });
    setTasks(data);
    setNoteDesc('');
    setNoteTitle('');
    translateY.value = 1;
  };

  const handleOnChange = (e: string, type: string) => {
    if (type === 'desc') {
      setNoteDesc(e);
    } else {
      setNoteTitle(e);
    }
  };

  const onDismiss = useCallback((task: TaskInterface) => {
    setTasks(tasks => tasks.filter(item => item.index !== task.index));
  }, []);

  const scrollRef = useRef(null);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, styles.text]}>Tasks</Text>
      <View ref={scrollRef} style={{height: '100%'}}>
        <FlatList
          data={tasks}
          renderItem={({item}) => (
            <ListItem
              simultaneousHandlers={scrollRef}
              key={item.index}
              task={item}
              onDismiss={onDismiss}
            />
          )}
        />
      </View>
      <View style={styles.addItemBtnContainer}>
        <Pressable onPress={() => handleAddNote()}>
          <AddIcon />
        </Pressable>
      </View>
      <Animated.View style={[styles.inputContainer, animatedStyle]}>
        <View style={styles.titleInputContainer}>
          <View
            style={{alignItems: 'flex-start', width: '90%', marginBottom: 15}}>
            <Text style={[styles.text, styles.titleInputText]}>Title</Text>
          </View>
          <TextInput
            value={noteTitle}
            style={styles.textInput}
            onChangeText={e => handleOnChange(e, 'title')}
          />
        </View>
        <View style={styles.descInputContainer}>
          <View
            style={{alignItems: 'flex-start', width: '90%', marginBottom: 15}}>
            <Text style={[styles.text, styles.titleInputText]}>
              Description
            </Text>
          </View>
          <TextInput
            value={noteDesc}
            style={styles.textInput}
            multiline={true}
            onChangeText={e => handleOnChange(e, 'desc')}
          />
        </View>
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Pressable
            onPress={() => handleAddNewNote()}
            style={styles.addNotePressable}>
            <Text style={[styles.text, {fontSize: 20}]}>Add</Text>
          </Pressable>
        </View>
        <View style={styles.addItemBtnContainer}>
          <Pressable onPress={() => handleCancelAddNote()}>
            <CancelIcon />
          </Pressable>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Swiper />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR,
    height: '100%',
  },
  title: {
    fontSize: 60,
    marginVertical: 20,
    paddingLeft: '5%',
  },
  text: {
    color: '#000000',
  },
  addItemBtnContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 20,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  inputContainer: {
    borderWidth: 1,
    position: 'absolute',
    width: '100%',
    height: '85%',
    bottom: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  textInput: {
    borderWidth: 1,
    width: '90%',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#000000',
    fontSize: 15,
  },
  titleInputContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  descInputContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  titleInputText: {
    fontSize: 25,
  },
  addNotePressable: {
    borderWidth: 1,
    height: 50,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
