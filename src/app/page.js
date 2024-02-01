'use client';
import VideoPart from "./component/videoPart/VideoPart";
import ImagePart from "./component/imagePart/imagePart"
const Home = () => {

  return (
    <div className="flex justify-around items-start">
      <VideoPart />
      <ImagePart />
    </div>
  );

};

export default Home;
