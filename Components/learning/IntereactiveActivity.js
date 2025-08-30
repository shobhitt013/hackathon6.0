import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const DragAndDropCategory = ({ data, onActivityComplete }) => {
  const [items, setItems] = useState(data.items.map(item => ({ ...item, id: item.name })));
  const initialColumns = {
    items: {
      id: 'items',
      title: 'Disasters',
      itemIds: items.map(item => item.id),
    },
    ...data.categories.reduce((acc, category) => {
      acc[category.id] = { id: category.id, title: category.title, itemIds: [] };
      return acc;
    }, {})
  };

  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      // Reordering within the same column
      const newItemIds = Array.from(start.itemIds);
      newItemIds.splice(source.index, 1);
      newItemIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, itemIds: newItemIds };
      setColumns({ ...columns, [newColumn.id]: newColumn });
    } else {
      // Moving from one column to another
      const startItemIds = Array.from(start.itemIds);
      startItemIds.splice(source.index, 1);
      const newStart = { ...start, itemIds: startItemIds };

      const finishItemIds = Array.from(finish.itemIds);
      finishItemIds.splice(destination.index, 0, draggableId);
      const newFinish = { ...finish, itemIds: finishItemIds };

      setColumns({
        ...columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      });
    }
  };

  const checkAnswers = () => {
    let correct = true;
    for (const item of items) {
      const parentColumn = Object.values(columns).find(col => col.itemIds.includes(item.id));
      if (!parentColumn || parentColumn.id !== item.category) {
        correct = false;
        break;
      }
    }

    if (correct) {
      alert("Correct! Well done.");
      onActivityComplete();
    } else {
      alert("Not quite right. Try again!");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{data.title}</h2>
      <p className="text-gray-600 mb-6">{data.instructions}</p>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(columns).map(column => (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 rounded-lg min-h-[200px] transition-colors ${
                    snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-100'
                  }`}
                >
                  <h3 className="font-bold mb-4">{column.title}</h3>
                  {column.itemIds.map((itemId, index) => {
                    const item = items.find(i => i.id === itemId);
                    return (
                      <Draggable draggableId={item.id} index={index} key={item.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 mb-2 rounded-md shadow-sm transition-colors ${
                              snapshot.isDragging ? 'bg-blue-200' : 'bg-white'
                            }`}
                          >
                            {item.name}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <div className="mt-8 flex justify-end">
        <Button onClick={checkAnswers}>
          Check My Work <Check className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default function InteractiveActivity({ module, onComplete }) {
  if (!module.interactive_activity || !module.interactive_activity.type) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold">Activity Complete!</h2>
        <p className="text-gray-600 my-4">This module doesn't have an interactive activity.</p>
        <Button onClick={onComplete}>
          Next: Quiz <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  switch (module.interactive_activity.type) {
    case 'drag_and_drop_category':
      return <DragAndDropCategory data={module.interactive_activity.data} onActivityComplete={onComplete} />;
    default:
      return <div className="text-center p-12">Unsupported activity type.</div>;
  }
}