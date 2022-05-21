import Head from 'next/head';
import SpeedtestUI from '../components/organism/SpeedtestUI';

const Home = () => {
  const downloadColors = ['#0ea5e9', '#22c55e'];
  const uploadColors = ['#8b5cf6', '#ec4899'];
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-900">
      <Head>
        <title>Speedtest</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SpeedtestUI
        id="speedTest"
        downloadTestColors={downloadColors}
        uploadTestColors={uploadColors}
        className="h-full w-full"
      />
    </div>
  );
};

export default Home;
