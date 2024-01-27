'use client';

import axios from 'axios';
import fileDownload from 'js-file-download';
import { useState } from 'react';

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
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
      <main class="flex  items-center justify-center bg-gray-100 font-sans mt-24">
        <label for="dropzone-file" class="mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed border-blue-400 bg-white p-6 text-center">
          {!selectedFile && <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>}

          {!selectedFile && <h2 class="mt-4 text-xl font-medium text-gray-700 tracking-wide">Payment File</h2>}

          {!selectedFile && <p class="mt-2 text-gray-500 tracking-wide">Upload or darg & drop your file SVG, PNG, JPG or GIF. </p>}

          {selectedFile && <p class="mt-2 text-gray-500 tracking-wide">Download you updated file . </p>}


          <input id="dropzone-file" type="file" class="hidden" onChange={handleFileChange} />
        </label>
      </main>
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
    </div>
  );
};

export default Home;
