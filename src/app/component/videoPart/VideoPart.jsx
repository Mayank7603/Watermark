'use client';
import axios from 'axios';
import fileDownload from 'js-file-download';
import { useState } from 'react';
import { HashLoader } from 'react-spinners';
import { Cloudinary } from '@cloudinary/url-gen';

const VideoPart = () => {
	const [selectedVideo, setselectedVideo] = useState(null);
	const [pid, setPid] = useState(null);
	const [loader, setLoader] = useState(false);
	const [invalidFile, setInvalidFile] = useState(false);

	const cld = new Cloudinary({ cloud: { cloudName: 'dqct40k0n' } });

	const handleFileChange = (event) => {
		setInvalidFile(false);
		setselectedVideo(null);
		setPid(null);
		const temp = event.target.files[0];

		if (!temp) return;
		console.log('temp: ', temp.type);
		if (temp.type !== 'video/mp4') {
			setInvalidFile(true);
		}
		setselectedVideo(event.target.files);
	};

	const handleUpload = async () => {
		if (!selectedVideo) {
			console.log('No File Selected');
			return;
		}
		setLoader(true);

		const formData = new FormData();
		formData.append(`files`, selectedVideo[0]);

		console.log(...formData);
		const ans = await axios.post(
			'http://51.79.161.51:3001/uploadVideo',
			formData
		);
		console.log(ans.data.public_id);
		setPid(ans.data.public_id);
	};

	function Video({ cloudName, watermarkId }) {
		if (pid) {
			let videoSource = `https://res.cloudinary.com/${cloudName}/video/upload`;

			videoSource += '/q_auto:best,w_600';
			const watermark = `l_${watermarkId.replace('/', ':')}`;

			videoSource += `/${watermark},g_south_east,w_100,x_20,y_20`;
			videoSource += `/${pid}.mp4`;
			setLoader(false);
			setselectedVideo(null);
			return (
				<video controls>
					<source
						src={videoSource}
						type="video/mp4"
					/>
				</video>
			);
		}
	}

	return (
		<div>
			<div className="flex flex-col gap-6 items-center justify-center font-sans mt-24 ">
				<label className="mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed border-blue-400 bg-white p-6 px-24 text-center h-40">
					{!selectedVideo ? (
						<div>
							<h2 className="mt-4 text-xl font-medium text-gray-700 tracking-wide">
								Input Video
							</h2>

							<p className="mt-2 text-gray-500 tracking-wide">
								{' '}
								Upload your Video{' '}
							</p>
						</div>
					) : (
						''
					)}

					{selectedVideo ? (
						<h2 className="text-lg text-slate-500">Please Upload Video </h2>
					) : (
						''
					)}

					<input
						id="dropzone-file"
						type="file"
						multiple
						className="hidden"
						onChange={handleFileChange}
					/>
				</label>

				<div className="flex gap-10">
					{!loader ? (
						<button
							className="p-4 mt-8 font-bold text-white bg-red-500 rounded-xl hover:scale-110 "
							onClick={handleUpload}
							disabled={invalidFile}>
							Upload
						</button>
					) : (
						''
					)}
				</div>

				{loader ? <p>Processing your file ... Please wait </p> : ''}
				{loader ? <HashLoader /> : ''}
				{invalidFile ? (
					<p className="text-lg text-slate-500">
						Invalid File Format ( Supported Format : .mp4 )
					</p>
				) : (
					''
				)}
				{pid ? (
					<Video
						cloudName="dqct40k0n"
						watermarkId="logo_2_nximfp"
					/>
				) : (
					''
				)}
			</div>
		</div>
	);
};

export default VideoPart;
