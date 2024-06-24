import Home from "../pages/Home";
import About from "../pages/About";
import Fibonacci from "../pages/algorithms/Fibonacci";
import CollisionDetection from "../pages/algorithms/CollisionDetection";
import MultiplyDouble from "../pages/algorithms/MultiplyDouble";
import MultiplyIntVector from "../pages/algorithms/MultiplyIntVector";
import MultiplyDoubleVector from "../pages/algorithms/MultiplyDoubleVector";
import QuicksortInt from "../pages/algorithms/QuicksortInt";
import QuicksortDouble from "../pages/algorithms/QuicksortDouble";
import SumInt from "../pages/algorithms/SumInt";
import SumDouble from "../pages/algorithms/SumDouble";
import ImageConvolute from "../pages/algorithms/imageConvolute";
import VideoConvolute from "../pages/algorithms/videoConvolute";
import SumConsecutiva from "../pages/algorithms/SumaConsecutiva";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/collision-detection",
    component: CollisionDetection,
  },
  {
    path: "/fibonacci",
    component: Fibonacci,
  },
  {
    path: "/multiply-double",
    component: MultiplyDouble,
  },
  {
    path: "/multiply-int-vector",
    component: MultiplyIntVector,
  },
  {
    path: "/multiply-double-vector",
    component: MultiplyDoubleVector,
  },
  {
    path: "/quicksort-int",
    component: QuicksortInt,
  },
  {
    path: "/quicksort-double",
    component: QuicksortDouble,
  },
  {
    path: "/sum-int",
    component: SumInt,
  },
  {
    path: "/sum-double",
    component: SumDouble,
  },
  {
    path: "/image-convolute",
    component: ImageConvolute,
  },
  {
    path: "/video-convolute",
    component: VideoConvolute,
  },
  {
    path: "/sum-consecutiva",
    component: SumConsecutiva,
  },
  {
    path: "/about",
    component: About,
  },
];

export default routes;
