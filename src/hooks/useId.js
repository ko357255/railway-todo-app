import { useState } from 'react';

// ランダムな値を返すフック
export const useId = () => {
  // useState()を使うことで、再レンダリングされても値が変わらない
  const [id] = useState(() => {
    return Math.random().toString(32).substring(2);
  });

  return id;
};
