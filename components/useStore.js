'use client';

import create from 'zustand';

const getKey = (position) => position.join(':');

const createInitialBlocks = () => {
  const blocks = {};
  for (let x = -10; x <= 10; x += 1) {
    for (let z = -10; z <= 10; z += 1) {
      const baseHeight = Math.max(1, Math.round(Math.sin(x * 0.4) + Math.cos(z * 0.35) + 2));
      for (let y = 0; y < baseHeight; y += 1) {
        const position = [x, y, z];
        const type = y === baseHeight - 1 ? 'grass' : y < 1 ? 'stone' : 'dirt';
        blocks[getKey(position)] = { position, type };
      }
    }
  }
  return blocks;
};

const neighbourOffsets = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1]
];

const useStore = create((set, get) => ({
  blocks: createInitialBlocks(),
  addBlock: (position, type = 'grass') => {
    set((state) => {
      const key = getKey(position);
      if (state.blocks[key]) {
        return state;
      }
      const newBlocks = { ...state.blocks };
      newBlocks[key] = { position, type };
      return { blocks: newBlocks };
    });
  },
  removeBlock: (position) => {
    const key = getKey(position);
    set((state) => {
      if (!state.blocks[key]) {
        return state;
      }
      const { [key]: _, ...rest } = state.blocks;
      return { blocks: rest };
    });
  },
  getExposedFaces: (position) => {
    const faces = [];
    neighbourOffsets.forEach((offset, index) => {
      const neighbour = position.map((value, idx) => value + offset[idx]);
      const key = getKey(neighbour);
      if (!get().blocks[key]) {
        faces.push(index);
      }
    });
    return faces;
  }
}));

export { getKey };
export default useStore;
