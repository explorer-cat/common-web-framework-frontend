// store.js

import { create } from 'zustand' // create로 zustand를 불러옵니다.

const useMyWallet = create(set => ({
  myWallets: [],
  setMyWallets: (newItems) => set(() => ({
    myWallets: newItems  // myWallets를 새로운 배열로 설정
  })),
}));


export default useMyWallet