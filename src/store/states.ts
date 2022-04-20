import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const { persistAtom: cookiePersistAtom } = recoilPersist({
  storage: {
    setItem: (key, value) => {
      const entries = JSON.parse(value);
      Object.entries(entries).forEach(([key, value]) => {
        cookies.set(key, value, {
          path: `/`,
          domain: process.env.REACT_APP_BASE_DOMAIN,
        });
      });
    },
    getItem: (key) => cookies.get(key) ?? null,
  },
});

export const localeState = atom<string>({
  key: `locale`,
  default: "en",
  effects: [cookiePersistAtom],
});
