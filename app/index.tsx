import { Button, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { File, Paths } from 'expo-file-system';

export default function Index() {

  const [file, setFile] = useState<File>(new File(Paths.document, "large.bin"));
  const [size, setSize] = useState<Number>(0);
  const [result, setResult] = useState<String>("");
  let url = "https://d29eyfcvtmltqk.cloudfront.net/large.bin";

  useEffect(() => {
    setInterval(() => {
      if (file?.exists) {
        setSize(file.size);
      }
    }, 1000);
  }, []);

  const download = async () => {
    try {
      if (!file.exists) {
        await File.downloadFileAsync(url, file);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const slice = async () => {
    try {
      if (file?.exists) {
        const fh = await file.open();
        if (fh) {
          fh.offset = 0;
          const ba16 = await fh.readBytes(16);
          setResult([...ba16].map(b => b.toString(16).padStart(2, '0')).join(''));
          await fh.close();
        }
      }
    } catch (err) {
      console.error(err);
      setResult(err.toString());
    }
  }
  const del = async () => {
    try {
      if (file) {
        file.delete();
      }
    } catch (err) {
      setResult(err.toString());
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="download" onPress={download}></Button>
      <Text>{size?.toString()}</Text>
      <Button title="slice" onPress={slice}></Button>
      <Text>{result}</Text>
      <Button title="delete" onPress={del}></Button>
    </View>
  );
}