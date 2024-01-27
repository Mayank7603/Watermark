'use client';

import axios from 'axios';
import fileDownload from 'js-file-download';
import { useState } from 'react';

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    console.log("file change handling");
    setSelectedFile(event.target.files[0]);
    // setSelectedFile({...selectedFile + eve})
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.log("ds");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    await axios.post('http://localhost:3001/upload', formData);
  };

  const handleDownload = (e) => {
    e.preventDefault();
    axios({
      url: 'http://localhost:3001/dnd',
      method: 'GET',
      responseType: 'blob',
    }).then((res) => {
      fileDownload(res.data, 'watermarked.png');
    });


    setSelectedFile(null);
  };

  return (
    <div className="flex flex-col gap-12 items-center justify-center">
      <div className="flex  items-center justify-center bg-gray-100 font-sans mt-24">
        <label className="mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed border-blue-400 bg-white p-6 text-center">
          {/* {!selectedFile && <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>} */}

          {!selectedFile && <h2 className="mt-4 text-xl font-medium text-gray-700 tracking-wide" > Input File</h2 >}

          {!selectedFile && <p className="mt-2 text-gray-500 tracking-wide" > Upload or darg & drop your file SVG, PNG, JPG or GIF. </p >}

          {selectedFile && <p className="mt-2 text-gray-500 tracking-wide" > Upload and Download you updated file. </p >}


          <input id="dropzone-file" type="file" multiple className="hidden" onChange={handleFileChange} />
        </label >
      </div >
      <div className="flex gap-10">
        <button
          className="p-4 font-bold text-white bg-red-500 rounded-xl hover:scale-110"
          onClick={handleUpload}>
          Upload
        </button>
        {selectedFile && <button
          className="p-4 font-bold text-white bg-green-500 rounded-xl hover:scale-110"
          onClick={handleDownload}>
          Download
        </button>}
      </div>
    </div >
  );
};

export default Home;
