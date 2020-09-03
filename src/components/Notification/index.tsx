import { OptionsObject, TransitionHandler, useSnackbar } from "notistack";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { actRemove } from "../../reducers/notify";

type MessageHash = RootState["notify"];

// 对当前显示队列的操作要保证原子性，所有将队列保存在本地，保证同步原子操作
const sourceMessages: MessageHash = {};

const getDiffMessage = (targetMessages: MessageHash) => {
  const removed = Object.values(sourceMessages).filter((message) => !targetMessages[message.key]);
  const added = Object.values(targetMessages).filter((message) => !sourceMessages[message.key]);
  return { removed, added };
};

const defaultOptions: OptionsObject = {
  anchorOrigin: {
    horizontal: "right",
    vertical: "top",
  },
};

export function Notification() {
  const targetMessages = useSelector<RootState, MessageHash>((state) => state.notify);
  const dispatch = useDispatch();
  const { added, removed } = useMemo(() => getDiffMessage(targetMessages), [targetMessages]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  useEffect(() => {
    added.forEach((message) => {
      const { label, ...options } = message;
      const onExit: TransitionHandler = (elm, key) => {
        delete sourceMessages[key];
        dispatch(actRemove(key));
      };
      enqueueSnackbar(label, { ...defaultOptions, ...options, onExit });
      sourceMessages[message.key] = message;
    });
    removed.forEach(({ key }) => {
      closeSnackbar(key);
      delete sourceMessages[key];
    });
  }, [added, removed, dispatch, enqueueSnackbar, closeSnackbar]);
  return null;
}
