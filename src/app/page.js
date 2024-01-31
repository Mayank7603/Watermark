'use client';
import axios from 'axios';
import fileDownload from 'js-file-download';
import { useState } from 'react';
import { HashLoader } from 'react-spinners';

const Home = () => {
  const maxSize = 9000;
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [txt, showtxt] = useState(false);
  const [btn, setBtn] = useState(true);
  const [invalidFile, setInvalidFile] = useState(true);
  const [numFile, setNumFile] = useState(0);
  const [circle, showCircle] = useState(false);
  const [less, setLess] = useState(true);
  const [maxFile, setMaxFile] = useState(false);
  const [prev, setprev] = useState(true);

  const handleSecond = (data) => {

    if (data) {
      // console.log("Null nhi h bhai ");
      console.log(data);
      setNumFile(data.length)
    } else {
      console.log("Null hai bhai ");
    }
  }

  const handleFirst = (event) => {
    console.log("file change handling");
    const temp = event.target.files[0];
    setMaxFile(false);
    setprev(true);

    if (!temp) return;
    const pattern = "image/(png|jpg|jpeg|webp)";

    if (temp.type.match(pattern)) {

      console.log("yha aa gya");
      setInvalidFile(true);

      if (temp.size < maxSize) {
        setBtn(false);
        setLess(false);
      } else {

        setLess(true);
        setBtn(true);
        console.log("set kr diya bhai ");
        setSelectedFiles(event.target.files);
        return event.target.files;
      }

    } else {
      console.log("niceh wala");
      setInvalidFile(false);
      setBtn(false)
    }

  };

  // console.log("selected", selectedFiles)

  const handleFileChange = async (event) => {
    const res = handleFirst(event);
    handleSecond(res);
    // setprev(false);
  }

  const handleUpload = async () => {
    if (!selectedFiles) {
      console.log("No File Selected");
      return;
    }
    setprev(false);

    const formData = new FormData();
    const pattern = "image/(png|jpg|jpeg|webp)";
    // console.log("upload issue starting");
    const maxFileSize = 5000000;
    var tempSize = 0;
    for (let i = 0; i < selectedFiles.length; i++) {

      if (selectedFiles[i].type.match(pattern)) {
        // console.log("yha aa gya part");
        setInvalidFile(true);

        if (selectedFiles[i].size < maxSize) {
          setBtn(false);
          setLess(true);
          setSelectedFiles(null);
        } else {
          tempSize += selectedFiles[i].size;
          setLess(true);
          setBtn(true);
        }

      } else {
        // console.log("niceh wala part");
        setInvalidFile(false);
        setBtn(false)
        setSelectedFiles(null);
        return;
      }
    }

    if (tempSize > maxFileSize) {
      setMaxFile(true);
    } else {
      setMaxFile(false);
    }

    for (let i = 0; i < selectedFiles.length; i++) {

      console.log(`file ${i + 1} uploading`);
      formData.append(`files`, selectedFiles[i]);

    }

    // console.log(...formData);
    setNumFile(selectedFiles.length)
    await axios.post('http://localhost:3001/upload', formData);
  };

  // const handleUploadVideo = async () => {
  //   if (!selectedVideo) {
  //     console.log("No video selected.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   console.log(`Video uploading`);
  //   formData.append('video', selectedVideo, selectedVideo.name);

  //   try {
  //     const response = await axios.post('http://localhost:3001/uploadVideo', formData);
  //     console.log('Upload successful:', response.data);
  //   } catch (error) {
  //     console.error('Upload failed:', error.message);
  //   }
  // };

  // const handleVideoChange = (event) => {
  //   const temp = event.target.files[0];
  //   console.log(temp);
  //   setSelectedVideo(temp);
  // }

  const handleDownload = async (e) => {
    showtxt(true);
    showCircle(true);
    e.preventDefault();
    await axios.get('http://localhost:3001/download', {
      responseType: 'blob',
    }).then((res) => {
      console.log(res.data);
      fileDownload(res.data, "watermarked.zip");
    });

    setSelectedFiles(null);
    showtxt(false)
    showCircle(false);
    setNumFile(0);
    setprev(true);
  };



  return (
    <div className="flex flex-col gap-12 items-center justify-center">
      <div className="flex  items-center justify-center bg-gray-100 font-sans mt-24">
        <label className="mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed border-blue-400 bg-white p-6 px-24 text-center">

          {prev && <h2 className="mt-4 text-xl font-medium text-gray-700 tracking-wide" > Input Photos</h2 >}

          {prev && <p className="mt-2 text-gray-500 tracking-wide" > Upload your file  </p >}

          {!prev && <p className="mt-2 text-gray-500 tracking-wide" > Download you updated file. </p >}


          <input id="dropzone-file" type="file" multiple className="hidden" onChange={handleFileChange} />
        </label >
      </div >
      <div className="flex gap-10">
        {prev && <button
          className="p-4 font-bold text-white bg-red-500 rounded-xl hover:scale-110 "
          disabled={!btn}
          onClick={handleUpload}>
          Upload
        </button>}
        {!prev && !circle && <button
          className="p-4 font-bold text-white bg-green-500 rounded-xl hover:scale-110"
          onClick={handleDownload}>
          Download
        </button>}

      </div>

      {/* {maxFile ? <div> Maximum file size exceeded </div> : ""} */}

      {numFile != 0 && !circle &&

        <div>{numFile} files are selected</div>

      }

      {txt &&
        <div className='text-slate-500 text-xl'>
          Downloading {numFile} Files ...
        </div>
      }
      {
        circle &&
        <HashLoader />
      }
      {!less &&
        <div className='text-slate-400'>
          File Size is below 5kb
        </div>
      }


      {!invalidFile &&
        <div className='
      text-slate-400'>
          Invalid File Format ( Accepted format are : jpg, png, jpeg, webp)
        </div>}

      {/* <div className="flex  items-center justify-center bg-gray-100 font-sans mt-24">
        <label className="mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed border-blue-400 bg-white p-6 px-24 text-center">

          {!selectedFiles && <h2 className="mt-4 text-xl font-medium text-gray-700 tracking-wide" > Input Video</h2 >}

          {!selectedFiles && <p className="mt-2 text-gray-500 tracking-wide" > Upload  your file  </p >}

          {selectedFiles && <p className="mt-2 text-gray-500 tracking-wide" > Upload and Download you updated file. </p >}


          <input id="dropzone-file" type="file" className="hidden" onChange={handleVideoChange} />
        </label >
      </div >
      <div className="flex gap-10">
        <button
          className="p-4 font-bold text-white bg-red-500 rounded-xl hover:scale-110 "
          disabled={!btn}
          onClick={handleUploadVideo}>
          Upload
        </button>
        {selectedFiles && <button
          className="p-4 font-bold text-white bg-green-500 rounded-xl hover:scale-110"
          onClick={handleDownloadVideo}>
          Download
        </button>}

      </div> */}

    </div >
  );
};

export default Home;
