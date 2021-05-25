
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Props as DndContextProps } from '@dnd-kit/core/dist/components/DndContext/DndContext';
import React, { PropsWithChildren } from 'react';

export interface DndContextAdaptorProps extends PropsWithChildren<DndContextProps> {};

export function DndContextAdaptor(props: DndContextAdaptorProps) {
  const { onDragEnd, children, ...dndContetProps } = props;
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(
    mouseSensor,
    touchSensor,
  );
  const handleDropEnd = (e: DragEndEvent) => {
    onDragEnd?.(e);
    const { active, over } = e;
    if (!active || !over ||  !over.data.current?.accept.includes(active.data.current?.type)) return;
    over.data.current.drop?.(active.data.current);
  };
  return (
    <DndContext sensors={sensors} autoScroll={false} onDragEnd={handleDropEnd} {...dndContetProps}>
      {props.children}
    </DndContext>
  );
}