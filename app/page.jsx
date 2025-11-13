import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('../components/Scene'), {
  ssr: false
});

export default function HomePage() {
  return (
    <main className="wrapper">
      <div className="hud">
        <h1>Mindcraft 3D</h1>
        <p>Build and sculpt a voxel world. Click faces to extend blocks, hold Shift to remove.</p>
        <div className="controls">
          <span>Left click: add block</span>
          <span>Shift + click: remove block</span>
          <span>Right click drag: orbit</span>
          <span>Scroll: zoom</span>
        </div>
      </div>
      <Scene />
    </main>
  );
}
