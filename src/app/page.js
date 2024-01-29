'use client';

import axios from 'axios';
import fileDownload from 'js-file-download';
import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
// const images = require.context("./api/upload/uploads_output", true);
// const imageList = images.keys().map(image => images(image));
// console.log(imageList);

const Home = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [txt, showtxt] = useState(false);

  const handleFileChange = (event) => {
    console.log("file change handling");
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) {
      console.log("ds");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      console.log(`file ${i + 1} uploading`);
      formData.append(`files`, selectedFiles[i]);
    }
    console.log(...formData);

    await axios.post('http://localhost:3001/upload', formData);
  };

  const handleDownload = async (e) => {
    showtxt(true);

    e.preventDefault();
    await axios.get('http://localhost:3001/download', {
      responseType: 'blob',
    }).then((res) => {
      console.log(res.data);
      fileDownload(res.data, "watermarked.zip");
    });

    setSelectedFiles(null);
    showtxt(false)

  };

  return (
    <div className="flex flex-col gap-12 items-center justify-center">
      <div className="flex  items-center justify-center bg-gray-100 font-sans mt-24">
        <label className="mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed border-blue-400 bg-white p-6 text-center">

          {!selectedFiles && <h2 className="mt-4 text-xl font-medium text-gray-700 tracking-wide" > Input File</h2 >}

          {!selectedFiles && <p className="mt-2 text-gray-500 tracking-wide" > Upload or darg & drop your file SVG, PNG, JPG or GIF. </p >}

          {selectedFiles && <p className="mt-2 text-gray-500 tracking-wide" > Upload and Download you updated file. </p >}


          <input id="dropzone-file" type="file" multiple className="hidden" onChange={handleFileChange} />
        </label >
      </div >
      <div className="flex gap-10">
        <button
          className="p-4 font-bold text-white bg-red-500 rounded-xl hover:scale-110"
          onClick={handleUpload}>
          Upload
        </button>
        {selectedFiles && <button
          className="p-4 font-bold text-white bg-green-500 rounded-xl hover:scale-110"
          onClick={handleDownload}>
          Download
        </button>}

      </div>

      {txt &&
        <div className='text-slate-500 text-xl'>
          Your download will begin in 5 seconds.
        </div>
      }
    </div >
  );
};

export default Home;
