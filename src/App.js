import React, { useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';
import ImageUploader from 'react-images-upload';
import './App.css';

function App() {

  const [ocr, setOcr] = useState('Select Image to read...');
  const [pictures, setPictures] = useState({});
  // const [pictures, setPictures] = useState<any>[];

  const worker = createWorker({
    logger: m => console.log(m),
  });

  const doOCR = async () => {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize('notice.png');
    setOcr(text);
  };

  const readImageOCR = async (image) => {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(image);
    await setOcr(text);
    await convertTextToLocalLang(text)
  };

  const convertTextToLocalLang = async (textEng) => {
    setOcr('Reading Completed...!');
    setOcr('Converting..............');
    fetch(
      `https://node-watson-api.herokuapp.com/api?text=${textEng}`,
      {
        method: "GET",
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }
    )
    .then(res => res.json())
    .then(response => {
      console.log("response = ", response.msg)
      setOcr(response.msg);
    })
    .catch(error => console.log(error));
  };

  useEffect(() => {
    // doOCR();
  });

  useEffect(() => {
    if(pictures.name) {
      setOcr('Reading..............');   
      readImageOCR(pictures)
    }
  }, [pictures]);

  const onImageSelect = (pictureFiles) => {
    setPictures(pictureFiles[0]);
  }

  return (
    <>
      <div className="App">
        <p>{ocr}</p>
      </div>

      <ImageUploader
        withIcon={true}
        buttonText='Choose images'
        onChange={onImageSelect}
        imgExtension={['.jpg', '.gif', '.png', '.gif']}
        maxFileSize={5242880}
        singleImage={true}
      />
    </>
  );
}

export default App;
