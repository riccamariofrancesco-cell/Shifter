import React, { useState } from 'react';
import InputField from './InputField';
import Button from './Button';

interface Asset {
  id: number;
  sourceName: string;
  amount: number;
  currency: string;
}

interface SectionCardProps {
  title: string;
  items: Asset[];
  onAddAsset: () => void;
  currency?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  items,
  onAddAsset,
  currency = 'EUR',
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editSource, setEditSource] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const handleSave = async (id: number) => {
    // In a real app, you would call an API to update the asset
    console.log(`Saving asset ${id}:`, { sourceName: editSource, amount: parseFloat(editAmount) });
    setEditingId(null);
    // Reset edit state
    setEditSource('');
    setEditAmount('');
  };

  const handleDelete = async (id: number) => {
    // In a real app, you would call an API to delete the asset
    console.log(`Deleting asset ${id}`);
  };

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <button
          onClick={onAddAsset}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Aggiungi Fonte
        </button>
      </div>

      {/* Total */}
      <div className="mb-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-lg font-semibold text-blue-800">
          Totale {title.toLowerCase()}: {total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} {currency}
        </p>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-4 bg-gray-50 rounded-xl"
          >
            {!editingId || editingId !== item.id ? (
              <>
                <span className="flex-1 text-gray-700">{item.sourceName}</span>
                <span className="text-gray-600">{item.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} {item.currency}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setEditSource(item.sourceName);
                      setEditAmount(item.amount.toString());
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Elimina
                  </button>
                </div>
              </>
            ) : (
              <>
                <InputField
                  value={editSource}
                  onChange={(e) => setEditSource(e.target.value)}
                  placeholder="Nome fonte"
                  className="flex-1 mr-2"
                />
                <InputField
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  placeholder="Importo"
                  type="number"
                  className="w-24 mr-2"
                />
                <Button
                  onClick={() => handleSave(item.id)}
                  variant="success"
                  size="sm"
                >
                  Salva
                </Button>
                <Button
                  onClick={() => {
                    setEditingId(null);
                    setEditSource('');
                    setEditAmount('');
                  }}
                  variant="secondary"
                  size="sm"
                >
                  Annulla
                </Button>
              </>
            )}
          </div>
        ))}

        {/* Empty state */}
        {items.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            Nessuna fonte aggiunta. Clicca su "Aggiungi Fonte" per iniziare.
          </p>
        )}
      </div>
    </div>
  );
};

export default SectionCard;